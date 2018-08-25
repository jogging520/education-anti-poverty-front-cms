import { Component, OnInit } from '@angular/core';
import {NzMessageService} from "ng-zorro-antd";
import {User} from "@shared/models/general/user";
import {UserService} from "@shared/services/general/user.service";
import {tap, map} from "rxjs/operators";
import {CommonService} from "@shared/services/general/common.service";
import {ActivatedRoute} from "@angular/router";

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

  tabs: any[] = [
    {
      key: 'gansu',
      tab: '甘肃省',
    },
    {
      key: 'lanzhou',
      tab: '兰州',
    },
    {
      key: 'dingxi',
      tab: '定西',
    },
    {
      key: 'pingliang',
      tab: '平凉',
    },
    {
      key: 'qingyang',
      tab: '庆阳',
    },
    {
      key: 'jiuquan',
      tab: '酒泉',
    },
    {
      key: 'jiayuguan',
      tab: '嘉峪关',
    },
    {
      key: 'wuwei',
      tab: '武威',
    },
    {
      key: 'jinchang',
      tab: '金昌',
    },
    {
      key: 'linxia',
      tab: '临夏',
    },
    {
      key: 'longnan',
      tab: '陇南',
    },
    {
      key: 'baiyin',
      tab: '白银',
    },
    {
      key: 'tianshui',
      tab: '天水',
    },
    {
      key: 'gannan',
      tab: '甘南',
    }
  ];

  users: User[] = [];

  loading = false;



  constructor(private activatedRoute: ActivatedRoute,
              public messageService: NzMessageService,
              private commonService: CommonService,
              private userService: UserService) {
    this.activatedRoute
      .data
      .pipe(map(data => data.userParams))
      .subscribe((data) => {
        this.users = data;
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
    this.messageService.warning('马野演示');
  }

}
