import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import {OperationService} from "@shared/services/general/operation.service";
import {Operation} from "@shared/models/general/operation";
import {NzMessageService} from "ng-zorro-antd";
import {tap} from "rxjs/operators";
import {CommonService} from "@shared/services/general/common.service";
import {StrategyService} from "@shared/services/general/strategy.service";
import {Strategy} from "@shared/models/general/strategy";
import {UserService} from "@shared/services/general/user.service";
import {User} from "@shared/models/general/user";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {SystemOperationViewComponent} from "./view/view.component";

@Component({
  selector: 'app-system-operation',
  templateUrl: './operation.component.html',
})
export class SystemOperationComponent implements OnInit {

  //查询组合条件
  conditions: any = {};
  //渠道类型（应用类型）
  channelTypes = [];
  //业务类型
  businessTypes = [];
  //全量用户
  users = [];
  //操作记录数据
  operations: Operation[] = [];
  //加载中状态
  loading = false;

  @ViewChild('st') st: SimpleTableComponent;
  columns: SimpleTableColumn[] = [
    { title: '操作编号', index: 'id' },
    { title: '操作人员',
      index: 'user',
      format: (operation: Operation) => {
        let formattedUser = '';

        this.users
          .forEach((user, index, array) => {
            if (operation.user.toLocaleUpperCase() === user.value.toLocaleUpperCase())
              formattedUser = user.text;
          });

        return formattedUser;
      }
    },
    { title: '渠道类型',
      index: 'appType',
      format: (operation: Operation) => {
        let formattedAppType = '';

        this.channelTypes
          .forEach((channelType, index, array) => {
          if (operation.appType.toLocaleUpperCase() === channelType.value.toLocaleUpperCase())
            formattedAppType = channelType.text;
          });

        return formattedAppType;
      }
    },
    { title: '业务类型',
      index: 'businessType',
      format: (operation: Operation) => {
        let formattedBusinessType = '';

        this.businessTypes
          .forEach((businessType, index, array) => {
            if (operation.businessType.toLocaleUpperCase() === businessType.value.toLocaleUpperCase())
              formattedBusinessType = businessType.text;
          });

        return formattedBusinessType;
      }
    },
    { title: '操作时间',
      type: 'date',
      index: 'createTime',
      sorter: (a: any, b: any) => a.createTime - b.createTime,
    },
    {
      title: '',
      buttons: [
        { text: '详情', type: 'static', component: SystemOperationViewComponent, click: 'reload' }
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private modal: ModalHelper,
              public messageService: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              private commonService: CommonService,
              private operationService: OperationService,
              private strategyService: StrategyService,
              private userService: UserService
  ) {
    this.queryChannelTypes();
    this.queryBusinessTypes();
    this.queryUsers();
  }

  ngOnInit() {
    this.queryDefaultOperations();
  }

  /**
   * 方法：默认初始化查询操作记录
   */
  private queryDefaultOperations(): void {
    this.conditions.fromCreateTime = CommonService.lastDate();
    this.conditions.toCreateTime = CommonService.currentDate();
    this.queryOperations();
  }

  /**
   * 方法：获取应用类型枚举值
   */
  private queryChannelTypes(): void {
    this.strategyService
      .queryStrategies('appTypes')
      .pipe(tap())
      .subscribe((strategy: Strategy) => {
          if (strategy.status === 'SUCCESS' && strategy.parameters) {
            Object.keys(strategy.parameters)
              .forEach((key) => {
                if (strategy.parameters[key] != null)
                  this.channelTypes.push({'text': strategy.parameters[key], 'value': key});
              });
          }
        },
        () => {
          this.messageService.warning('获取应用类型数据失败。');
        }
      );
  }

  /**
   * 方法：获取应用类型枚举值
   */
  private queryBusinessTypes(): void {
    this.strategyService
      .queryStrategies('businessTypes')
      .pipe(tap())
      .subscribe((strategy: Strategy) => {
          if (strategy.status === 'SUCCESS' && strategy.parameters) {
            Object.keys(strategy.parameters)
              .forEach((key) => {
                if (strategy.parameters[key] != null)
                  this.businessTypes.push({'text': strategy.parameters[key], 'value': key});
              });
          }
        },
        () => {
          this.messageService.warning('获取业务类型数据失败。');
        }
      );
  }

  /**
   * 方法：获取全量用户信息
   */
  private queryUsers(): void {

    const tokenData = this.tokenService.get();

    this.userService
      .queryUsers()
      .pipe(tap())
      .subscribe((user: User) => {
          if (user.status === 'SUCCESS') {
            this.users.push({'text': decodeURIComponent(escape(atob(this.commonService.decrypt(user.realName)))), 'value': user.id});
          }
        },
        () => {
          this.messageService.warning('获取用户数据失败。');
        },
        () => {
          if (tokenData.roles && tokenData.roles.indexOf('admin') > -1) {
            this.users.push({'text': '全部', 'value': 'ffffffffffffffffffffffff'});
          }
        });
  }

  /**
   * 方法：根据组合条件查询操作记录
   */
  private queryOperations(): void {
    let data = [];

    this.loading = true;

    this.operationService
      .queryOperations(this.conditions)
      .pipe(tap())
      .subscribe((operation: Operation) => {
          if (operation.status === 'SUCCESS') {
            data.push(operation);
          }},
        () => {
          this.messageService.warning('获取操作记录数据失败。');
          this.loading = false;
        },
        () => {
          this.operations = data;
          this.loading = false;
        }
      )
  }

  /**
   * 方法：createTime时间提取器点击确认后的事件
   * @param event 事件
   */
  private onCreateTimeOk(event: any): void {
    this.conditions.fromCreateTime = event[0];
    this.conditions.toCreateTime = event[1];
  }

  /**
   * 方法：createTime时间提取器时间变更后的事件
   * @param event 事件
   */
  private onCreateTimeChange(event: any): void {
    this.conditions.fromCreateTime = event[0];
    this.conditions.toCreateTime = event[1];
  }
}
