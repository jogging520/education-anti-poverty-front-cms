import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import {OperationService} from "@shared/services/general/operation.service";
import {Operation} from "@shared/models/operation";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-system-operation',
  templateUrl: './operation.component.html',
})
export class SystemOperationComponent implements OnInit {

  operations: Operation[] = [];
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  @ViewChild('st') st: SimpleTableComponent;
  columns: SimpleTableColumn[] = [
    { title: '编号', index: 'id' },
    { title: '用户', index: 'user' },
    { title: '渠道', index: 'appType'},
    { title: '业务类型', index: 'businessType'},
    { title: '操作时间', type: 'date', index: 'createTime' },
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
    this.queryOperations({});
  }

  queryOperations(condition: Object): void {
    let data = [];

    this.operationService
      .queryOperations(condition)
      .subscribe((operation: Operation) => {
          if (operation.status === 'SUCCESS') {
            data.push(operation);
            //console.log(operation);
          }},
        () => {
          this.messageService.warning('获取操作记录数据失败。');
        },
        () => {
          this.operations = data;
        }
      )
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

}
