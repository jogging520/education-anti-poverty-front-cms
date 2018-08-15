import {Inject, Injectable} from '@angular/core';
import {CommonService} from "@shared/services/common.service";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import {Operation} from "@shared/models/operation";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs/index";
import {NzMessageService} from "ng-zorro-antd";
import {Router} from "@angular/router";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(
    private httpClient: _HttpClient,
    public messageService: NzMessageService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private commonService: CommonService
  ) { }

  /**
   * 方法：创建一条业务操作记录
   * @param {string} businessType 业务类型
   */
  public createOperation(businessType: string, serialNo?: string): void {

    const tokenData = this.tokenService.get();
    let id: string = '';

    if (serialNo)
      id = serialNo;
    else
      id = this.commonService.setSerialNo();

    console.log(serialNo);
    console.log(id);

    let operation: Operation = {
      id: id,
      type: 'COMMON',
      appType: `${environment.appType}`,
      category: `${environment.category}`,
      user: tokenData.user,
      session: tokenData.session,
      businessType: businessType,
      status: 'ACTIVE',
      description: 'auto created from front.'
    };

    this.httpClient
      .post(`${environment.serverUrl}operations`,
        operation,
        this.commonService.setParams({}),
        {headers: CommonService.setHeaders()}
        )
      .pipe(
        map((operation: Operation) => {
          if (operation.status !== 'SUCCESS') {
            return throwError(new Error(operation.status));
          }

          return operation;
        }),
        catchError(error => this.commonService.handleError(error)))
      .subscribe(
        () => {},
        () => {
          this.messageService.error('创建操作记录失败，请联系后台管理员处理。');
          this.router.navigate(['/500']).catch();
        }
      );
  }
}
