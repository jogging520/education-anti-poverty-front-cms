import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import {PolicyService} from "@shared/services/business/policy.service";
import {Policy} from "@shared/models/business/policy";
import {tap, flatMap} from "rxjs/internal/operators";
import * as GeneralConstants from "@shared/constants/general/general-constants";


@Component({
  selector: 'app-policy-list',
  templateUrl: './list.component.html',
})
export class PolicyListComponent implements OnInit {

  policies: Policy[] = [];

  @ViewChild('st') st: SimpleTableComponent;
  columns: SimpleTableColumn[] = [
    { title: '标题', index: 'name' },

  ];

  constructor(private modal: ModalHelper,
              private policyService: PolicyService) { }

  ngOnInit() {
    let data = [];

    this.policyService.queryPoliciesByName('中国')
      .pipe(tap(),
        flatMap((policies: Policy[]) => policies)
      )
      .subscribe(
        (policy: Policy) => {
          if (policy.status == GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_POLICY_STATUS_ACTIVE) {
            data.push(policy);
          }
        },
      () => {},
        () => {this.policies = data}


      )
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

}
