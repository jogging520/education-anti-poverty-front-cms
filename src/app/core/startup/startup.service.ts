import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {Menu, MenuService, SettingsService, TitleService} from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import {catchError, map, scan, flatMap} from "rxjs/operators";
import {environment} from "@env/environment";
import {CacheService} from "@delon/cache";
import {Strategy} from "@shared/models/general/strategy";
import {Role} from "@shared/models/general/role";
import { v4 as uuid } from 'uuid';
import {throwError} from "rxjs/index";
import {Region} from "@shared/models/general/region";
import {Organization} from "@shared/models/general/organization";
import * as GeneralConstants from "@shared/constants/general/general-constants";

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private injector: Injector,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private cacheService: CacheService,
    private httpClient: HttpClient
  ) { }

  private initial(resolve: any, reject: any, id?: string) {
    //1、设置headers信息，设置初始流水号
    let serialNo: string = '';

    if (!id) {
      serialNo = uuid();
      this.cacheService
        .set(GeneralConstants.CONSTANT_COMMON_CACHE_SERIAL_NO, serialNo);
    }

    const tokenData = this.tokenService.get();
    const currentTime = new Date().getTime();

    //2、如果没有登录或者已经超过登录时间，那么重定向到登录页面。
    if (!tokenData.token || !tokenData.loginTime || currentTime - tokenData.loginTime > tokenData.lifeTime) {
      this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
      resolve({});
      return;
    }

    //TODO 写一个通用的cache存放
    //3、获取应用程序相关信息、错误码相关信息等基础策略信息并设置
    this.httpClient
      .get(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_STRATEGY}`,
        {params: {
            types: [GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_STRATEGY_TYPE_APPLICATION,
              GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_STRATEGY_TYPE_ERROR_CODE]
              .join(GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_SEPARATOR)
          }}
      )
      .pipe(
        flatMap((strategy: any) => strategy),
        map((strategy: Strategy) => {
          if (strategy.status !== GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_STRATEGY_STATUS_ACTIVE) {
            return throwError(strategy.status);
          }

          return strategy;
        }),
        catchError(error => {
          this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
          resolve(null);
          return throwError(error);
        })
      )
      .subscribe(
        (strategy: Strategy) => {
          if (strategy.type === GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_STRATEGY_TYPE_APPLICATION) {
            this.settingService.setApp({name: strategy.name, description: strategy.description});
            this.titleService.suffix = strategy.name;
          }

          if (strategy.type === GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_STRATEGY_TYPE_ERROR_CODE) {
            this.cacheService.set(GeneralConstants.CONSTANT_COMMON_CACHE_ERROR_CODE, strategy.parameters);
          }
        },
        (error) => {
          this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
          resolve(null);
          throwError(error);
        }
      );

    //4、获取区域信息数据并设置
    this.httpClient
      .get(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_REGION}`
      )
      .pipe(
        flatMap((region: any) => region),
        map((region: Region) => {
          if (region.status !== GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_REGION_STATUS_ACTIVE) {
            return throwError(region.status);
          }

          return region;
        }),
        catchError(error => {
          this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
          resolve(null);
          return throwError(error);
        })
      )
      .subscribe(
        (region: Region) => {
            this.cacheService.set(GeneralConstants.CONSTANT_COMMON_CACHE_REGION, region);
        },
        (error) => {
          this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
          resolve(null);
          throwError(error);
        }
      );

    //5、获取组织机构数据并设置
    this.httpClient
      .get(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_ORGANIZATION}`
      )
      .pipe(
        flatMap((organization: any) => organization),
        map((organization: Organization) => {
          if (organization.status !== GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_ORGANIZATION_STATUS_ACTIVE) {
            return throwError(organization.status);
          }

          return organization;
        }),
        catchError(error => {
          this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
          resolve(null);
          return throwError(error);
        })
      )
      .subscribe(
        (organization: Organization) => {
          this.cacheService.set(GeneralConstants.CONSTANT_COMMON_CACHE_ORGANIZATION, organization);
        },
        (error) => {
          this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
          resolve(null);
          throwError(error);
        }
      );

    //6、获取角色权限信息，并设置；获取菜单相关信息并设置（必须在权限读取完之后设置菜单）
    this.aclService.removeAbility(this.aclService.data.abilities);
    this.aclService.removeRole(this.aclService.data.roles);
    this.menuService.clear();

    const roles = tokenData.roles;
    let abilities = tokenData.permissions;

    this.httpClient
      .get(
        `${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_ROLE}`,
        {params: {ids: roles.join(GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_SEPARATOR)}}
      )
      .pipe(
        flatMap((role: any) => role),
        map((role: Role) => {
          if (role.status !== GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_ROLE_STATUS_ACTIVE) {
            return throwError(role.status);
          }

          return role.permissions;
        }),
        scan((ability, permissions) => {
          for(let permission of permissions) {
            if(ability.indexOf(permission) == -1)
              ability.push(permission);
          }
          return ability;
        }, abilities),
        catchError(error => {
          this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
          resolve(null);
          return throwError(error);
        })
      )
      .subscribe(
        () => {},
        (error) => {
          this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
          resolve(null);
          throwError(error);
        },
        () => {
          this.aclService.setAbility(abilities);

          this.httpClient
            .get(
              `${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_MENU}\\${environment.appType}`,
              {}
            )
            .pipe(
              catchError(error => {
                this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
                resolve(null);
                return throwError(error);
              })
            )
            .subscribe(
              (menus: Menu[]) => {
                this.menuService.add(menus);
              },
              (error) => {
                this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
                resolve(null);
                throwError(error);
              },
              () => {
                this.injector.get(Router).navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_ROOT]).catch();
                resolve({});
              }
            );
        }
      );

    //7、设置初始的激活时间
    this.cacheService
      .set(GeneralConstants.CONSTANT_COMMON_CACHE_ACTIVE_TIME, new Date().getTime());

    return;
  }


  load(id?: string): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      this.initial(resolve, reject, id);
    });
  }
}
