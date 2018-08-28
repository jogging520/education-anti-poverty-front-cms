import { Component, OnInit } from '@angular/core';
import {NzMessageService} from "ng-zorro-antd";
import {User} from "@shared/models/general/user";
import {UserService} from "@shared/services/general/user.service";
import {tap, map} from "rxjs/operators";
import {CommonService} from "@shared/services/general/common.service";
import {ActivatedRoute} from "@angular/router";
import {TranslatorService} from "@shared/services/general/translator.service";
import {Organization} from "@shared/models/general/organization";
import {Region} from "@shared/models/general/region";

@Component({
  selector: 'app-system-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class SystemUserComponent implements OnInit {
  q: any = {
    ps: 8,
    categories: [],
    owners: ['zxx'],
  };

  tabs: any[] = [];

  users: User[] = [];
  organizationOptions:any  = [] ;
  regionOptions:any  = [] ;
  selectedOrganization: any[];
  selectedRegion: any[];

  loading = false;

  queryCondition: string = '';



  constructor(private activatedRoute: ActivatedRoute,
              public messageService: NzMessageService,
              private commonService: CommonService,
              private translatorService: TranslatorService,
              private userService: UserService) {
    this.activatedRoute
      .data
      .pipe(map(data => data))
      .subscribe((data) => {
        this.users = data.userParams;

        let organization: Organization = data.organizationParams;
        let region: Region = data.regionParams;

        this.organizationOptions.push(this.commonService.transform(this.commonService.locate(organization, 'EDU9')));
        this.regionOptions.push(this.commonService.transform(this.commonService.locate(region, '9')));

        this.locate(region, 'PROVINCE');
        this.locate(region, 'CITY');
      });
  }

  ngOnInit() {
    //this.getUsers();
  }

  private getUsers() {
    this.loading = true;

    this.userService
      .queryUsers()
      .pipe(tap())
      .subscribe((users: User[]) => {
          users.forEach((user: User) => {
            if (user.status === 'ACTIVE') {
              user.realName = decodeURIComponent(escape(atob(this.commonService.decrypt(user.realName))));
              this.users.push(user);
            }
          })
        },
        () => {
          this.messageService.warning('获取操作记录数据失败。');
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      )

    this.loading = false;
  }

  public search(): void {
    this.messageService.warning(this.queryCondition);
    console.log(this.translatorService.getFirstChar(this.queryCondition));
    console.log(this.translatorService.getFullChars(this.queryCondition));
    console.log(this.translatorService.getCamelChars(this.queryCondition));
  }

  onChanges(event: any): void {
    console.log(this.organizationOptions);
    console.log(this.selectedOrganization);
    console.log(event);
  }


  public locate(region: Region, level: string): Region {
    if(region.level === level) {
      this.tabs.push({key: region.code, tab: region.name});
    }

    let reg: Region;

    if (region.children) {
      for (var child of region.children) {
        reg = this.locate(child, level);

        if (reg)
          return reg;
      }
    }

    return null;
  }

}
