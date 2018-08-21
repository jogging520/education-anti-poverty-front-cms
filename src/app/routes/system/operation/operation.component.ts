import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import {OperationService} from "@shared/services/general/operation.service";
import {Operation} from "@shared/models/general/operation";
import {NzMessageService} from "ng-zorro-antd";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-system-operation',
  templateUrl: './operation.component.html',
})
export class SystemOperationComponent implements OnInit {

  condition: any = {};

  appTypes = [
    { index: 0, text: 'CMS管理后端系统', value: 'cms', type: 'default', checked: false },
    { index: 1, text: 'APP', value: 'app', type: 'processing', checked: false },
    { index: 2, text: '微信系统', value: 'wct', type: 'success', checked: false },
    { index: 3, text: '大屏系统', value: 'led', type: 'error', checked: false },
  ];

  businessTypes = [
    { index: 0, text: '学校', value: 'school', type: 'default', checked: false },
    { index: 1, text: '学生', value: 'student', type: 'processing', checked: false },
    { index: 2, text: '家庭', value: 'family', type: 'success', checked: false },
  ];

  operations: Operation[] = [];
  loading = false;

  @ViewChild('st') st: SimpleTableComponent;
  columns: SimpleTableColumn[] = [
    { title: '操作编号', index: 'id' },
    { title: '用户编号', index: 'user' },
    { title: '渠道类型',
      index: 'appType',
      format: (operation: Operation) => {
      let formattedAppType = '';

      switch(operation.appType) {
        case 'cms': formattedAppType = '后端管理系统'; break;
        case 'app': formattedAppType = 'APP'; break;
        default: formattedAppType = operation.appType;
      }

      return formattedAppType;
    }
      },
    { title: '业务类型',
      index: 'businessType',
      format: (operation: Operation) => {
        let formattedBusinessType = '';

        switch(operation.businessType) {
          case 'LOGIN': formattedBusinessType = '登录'; break;
          case 'LOGOUT': formattedBusinessType = '登出'; break;
          default: formattedBusinessType = operation.businessType;
        }

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
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private modal: ModalHelper,
              public messageService: NzMessageService,
              private operationService: OperationService
  ) { }

  ngOnInit() {
    this.queryOperations();
  }

  queryOperations(): void {
    let data = [];

    this.loading = true;

    this.operationService
      .queryOperations(this.condition)
      .pipe(tap(() => this.loading = false))
      .subscribe((operation: Operation) => {
          if (operation.status === 'SUCCESS') {
            data.push(operation);
          }},
        () => {
          this.messageService.warning('获取操作记录数据失败。');
        },
        () => {
          this.operations = data;
        }
      )
  }

  onOk(event: any) {
    this.condition.fromCreateTime = event[0];
    this.condition.toCreateTime = event[1];
    console.log(this.condition);
  }

  onChange(event: any) {
    this.condition.fromCreateTime = event[0];
    this.condition.toCreateTime = event[1];
    console.log(this.condition);
  }
}
