import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import {SessionService} from "@shared/services/general/session.service";
import {environment} from "@env/environment";
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {catchError, map} from "rxjs/internal/operators";
import {Operation} from "@shared/models/general/operation";
import {OperationService} from "@shared/services/general/operation.service";
import {throwError} from "rxjs/index";
import {CommonService} from "@shared/services/general/common.service";

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{settings.user.name}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-user mr-sm"></i>个人中心</div>
      <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-setting mr-sm"></i>设置</div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderUserComponent {
  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private sessionService: SessionService,
    private commonService: CommonService,
    private operationService: OperationService,
  ) {}

  logout() {
    this.operationService
      .createOperation(GeneralConstants.CONSTANT_MODULE_SHARED_SERVICE_OPERATION_BUSINESS_TYPE_LOGOUT,
        this.commonService.setSerialNo())
      .pipe(
        map((operation: Operation) => {
          if (operation.status !== GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_OPERATION_STATUS_SUCCESS) {
            return throwError(new Error(operation.status));
          }

          return operation;
        }),
        catchError(error => this.commonService.handleError(error))
      )
      .subscribe(
        () => {
        },
        () => {
          this.router.navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
        },
        () => {
          this.commonService.setSerialNo();

          this.sessionService
            .logout()
            .subscribe(
              () => {},
              (error) => {
                catchError(error => this.commonService.handleError(error))
                this.router.navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
              },
              () => {}
            );
        });
  }

}
