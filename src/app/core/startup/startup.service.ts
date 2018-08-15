import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MenuService, SettingsService, TitleService, Menu} from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import {catchError, map, scan, flatMap} from "rxjs/operators";
import {environment} from "@env/environment";
import {CacheService} from "@delon/cache";
import {Strategy} from "@shared/models/strategy";
import {Role} from "@shared/models/role";
import { v4 as uuid } from 'uuid';
import {throwError} from "rxjs/index";

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
    private httpClient: HttpClient,
  ) { }

  private initial(resolve: any, reject: any) {
    //1、设置headers信息
    let headers = {
      'Content-Type': `${environment.contentType}`,
      'Accept': `${environment.accept}`,
      'apikey': `${environment.apiKey}`
    };

    const serialNo = uuid();
    const tokenData = this.tokenService.get();
    const currentTime = new Date().getTime();

    //2、如果没有登录或者已经超过登录时间，那么重定向到登录页面。
    if (!tokenData.token || !tokenData.loginTime || currentTime - tokenData.loginTime > tokenData.lifeTime) {
      this.injector.get(Router).navigate(['/passport/login']);
      resolve({});
      return;
    }

    //3、获取应用程序相关信息并设置
    this.httpClient
      .get(`${environment.server_url}strategies\\application`,
        {headers: headers,
          params: {
            serialNo: serialNo,
            appType: `${environment.appType}`,
            category: `${environment.category}`}}
      )
      .pipe(
        flatMap((strategy: any) => strategy),
        catchError(error => {
          this.injector.get(Router).navigate(['/passport/login']);
          resolve(null);
          return throwError(error);
        })
      )
      .subscribe(
        (strategy: Strategy) => {
          this.settingService.setApp({name: strategy.name, description: strategy.description});
          this.titleService.suffix = strategy.name;
        },
        (error) => {
          this.injector.get(Router).navigate(['/passport/login']);
          resolve(null);
          throwError(error);
        }
      );

    //4、获取错误码相关信息，并缓存
    this.cacheService.remove('errorcode');
    this.httpClient
      .get(`${environment.server_url}strategies\\errorcode`,
        {headers: headers,
          params: {serialNo: serialNo,
            appType: `${environment.appType}`,
            category: `${environment.category}`}}
      )
      .pipe(
        flatMap((strategy: any) => strategy),
        catchError(error => {
          this.injector.get(Router).navigate(['/passport/login']);
          resolve(null);
          return throwError(error);
        })
      )
      .subscribe(
        (strategy: Strategy) => {
          this.cacheService.set('errorcode', strategy.parameters);
        },
        (error) => {
          this.injector.get(Router).navigate(['/passport/login']);
          resolve(null);
          throwError(error);
        }
      );

    //5、获取角色权限信息，并设置；获取菜单相关信息并设置（必须在权限读取完之后设置菜单）
    this.aclService.removeAbility(this.aclService.data.abilities);
    this.aclService.removeRole(this.aclService.data.roles);
    this.menuService.clear();

    const roles = tokenData.roles;
    const permissions = tokenData.permissions;

    let abilities = permissions;

    this.httpClient
      .get(
        `${environment.server_url}privileges\\roles`,
        {headers: headers,
          params: {serialNo: serialNo,
            appType: `${environment.appType}`,
            category: `${environment.category}`,
            roles: roles.join(',')}}
      )
      .pipe(
        flatMap((role: any) => role),
        map((role: Role) => role.permissions),
        scan((ability, permissions) => {
          for(let permission of permissions) {
            if(ability.indexOf(permission) == -1)
              ability.push(permission);
          }
          return ability;
        }, abilities),
        catchError(error => {
          this.injector.get(Router).navigate(['/passport/login']);
          resolve(null);
          return throwError(error);
        })
      )
      .subscribe(
        () => {
          console.info(this.aclService.data);
        },
        (error) => {
          this.injector.get(Router).navigate(['/passport/login']);
          resolve(null);
          throwError(error);
        },
        () => {
          this.aclService.setAbility(abilities);

          this.httpClient
            .get(
              `${environment.server_url}menus\\${environment.appType}`,
              {headers: headers,
                params: {serialNo: serialNo}}
            )
            .pipe(
              catchError(error => {
                this.injector.get(Router).navigate(['/passport/login']);
                resolve(null);
                return throwError(error);
              })
            )
            .subscribe(
              (menus: Menu[]) => {
                this.menuService.add(menus);
                console.info(this.menuService.menus);
              }
            );
        }
      )

    resolve({});
  }


  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      this.initial(resolve, reject);
    });
  }
}
