import { SettingsService } from '@delon/theme';
import {Component, Inject, OnDestroy, OnInit, Optional} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { SocialService, SocialOpenType } from '@delon/auth';
import { environment } from '@env/environment';
import {SessionService} from "@shared/services/general/session.service";
import {CommonService} from "@shared/services/general/common.service";
import {catchError, map} from "rxjs/internal/operators";
import {Operation} from "@shared/models/general/operation";
import {StartupService} from "@core/startup/startup.service";
import {ReuseTabService} from "@delon/abc";
import {throwError} from "rxjs/index";
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {OperationService} from "@shared/services/general/operation.service";

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    private startupService: StartupService,
    private sessionService: SessionService,
    private commonService: CommonService,
    private operationService: OperationService
  ) {

    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(5)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    modalSrv.closeAll();
  }

  ngOnInit(): void {
    this.commonService.clear();
    this.sessionService.clearIntervals();
  }

  // topCode: fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }

  // endregion

  switch(ret: any) {
    this.type = ret.index;
  }

  // topCode: get captcha

  count = 0;
  interval$: any;

  getCaptcha() {
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) clearInterval(this.interval$);
    }, 1000);
  }

  // endregion

  submit() {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) return;
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) return;
    }
    // mock http
    this.loading = true;
    this.error = '';

    this.sessionService
      .login(this.userName.value, this.password.value, this.mobile.value)
      .subscribe(
        () => {
          this.reuseTabService.clear();
          this.commonService.handleReuseTabExclude();
          this.startupService.load(this.commonService.getSerialNo()).catch();
        },
        (error) => {
          this.error = GeneralConstants.CONSTANT_MODULE_PASSPORT_LOGIN_COMMON_ERROR;
          this.loading = false;
          this.router.navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
        },
        () => {
          this.operationService
            .createOperation(GeneralConstants.CONSTANT_MODULE_SHARED_SERVICE_OPERATION_BUSINESS_TYPE_LOGIN,
              this.commonService.getSerialNo())
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
              () => {},
              () => {
                this.loading = false;
                this.router.navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
              },
              () => {
                this.loading = false;
              });
        });

    this.resetForm();
  }

  private resetForm(): void {
    this.form.reset();

    for (const key in this.form.controls) {
      this.form.controls[key].markAsPristine();
      this.form.controls[key].updateValueAndValidity();
    }
  }

  // topCode: social

  open(type: string, openType: SocialOpenType = 'href') {
    let url = ``;
    let callback = ``;
    if (environment.production)
      callback = 'https://cipchk.github.io/ng-alain/callback/' + type;
    else callback = 'http://localhost:4200/callback/' + type;
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window',
        })
        .subscribe(res => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href',
      });
    }
  }

  // endregion

  public onChange(event: any): void {
    if (this.error) {
      this.error = '';
    }
  }

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
