import { Component, OnInit } from '@angular/core';
import {NzMessageService} from "ng-zorro-antd";
import {User} from "@shared/models/general/user";
import {UserService} from "@shared/services/general/user.service";
import {tap, map} from "rxjs/operators";
import {CommonService} from "@shared/services/general/common.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslatorService} from "@shared/services/general/translator.service";
import {Region} from "@shared/models/general/region";
import { bounce } from 'ngx-animate';
import {transition, trigger, useAnimation} from "@angular/animations";
import {flip, jackInTheBox, tada, zoomIn} from "ngx-animate/lib";
import {CacheService} from "@delon/cache";
import * as BusinessConstants from "@shared/constants/business/business-constants";
import * as GeneralConstants from "@shared/constants/general/general-constants";

@Component({
  selector: 'app-system-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
  animations: [
    trigger('tada', [transition('* => *', useAnimation(tada,
      {params: { timing: 2, delay: 0 }
      }))])
  ],
})
export class SystemUserComponent implements OnInit {
  q: any = {
    ps: 8,
    categories: [],
    owners: ['zxx'],
  };

  tabs: any[] = [];
  users: User[] = [];
  loading = false;
  queryCondition: string = '';

  constructor(public messageService: NzMessageService,
              private router: Router,
              private cacheService: CacheService,
              private activatedRoute: ActivatedRoute,
              private commonService: CommonService,
              private translatorService: TranslatorService,
              private userService: UserService) {
    this.activatedRoute
      .data
      .pipe(map(data => data.userParams))
      .subscribe((data) => {
        this.users = data;
      });
  }

  ngOnInit() {
    this.cacheService
      .get<Region>(GeneralConstants.CONSTANT_SHARED_CACHE_REGION)
      .subscribe(region => {
        this.locateToSpecifiedLevel(region, BusinessConstants.CONSTANT_MODULE_SYSTEM_COMPONENT_USER_LOCATE_PROVINCE);
        this.locateToSpecifiedLevel(region, BusinessConstants.CONSTANT_MODULE_SYSTEM_COMPONENT_USER_LOCATE_CITY);
      });
  }

  private setRegionCode(event: any): void {
    console.log(event);
  }

  private getUsers(regionCode: string): void {

    this.loading = true;

    this.userService
      .queryUsers()
      .pipe(tap())
      .subscribe((users: User[]) => {
          users.forEach((user: User) => {
            if (user.status === BusinessConstants.CONSTANT_MODULE_SHARED_MODEL_USER_STATUS_ACTIVE) {
              user.realName = decodeURIComponent(escape(atob(this.commonService.decrypt(user.realName))));
              this.users.push(user);
            }
          })
        },
        () => {
          this.messageService.warning(BusinessConstants.CONSTANT_MODULE_SYSTEM_COMPONENT_USER_ERROR_GET_DATA);
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );

    this.loading = false;
  }

  public search(): void {
    this.messageService.warning(this.queryCondition);
    console.log(this.translatorService.getFirstChar(this.queryCondition));
    console.log(this.translatorService.getFullChars(this.queryCondition));
    console.log(this.translatorService.getCamelChars(this.queryCondition));
  }


  private locateToSpecifiedLevel(region: Region, level: string): Region {
    if(region.level === level) {
      this.tabs.push({key: region.code, tab: region.name});
    }

    let reg: Region;

    if (region.children) {
      for (let child of region.children) {
        reg = this.locateToSpecifiedLevel(child, level);

        if (reg)
          return reg;
      }
    }

    return null;
  }

  private createUser(): void {
    this.router.navigate([GeneralConstants.CONSTANT_SHARED_ROUTE_USER_CREATION]).catch();
  }
}
