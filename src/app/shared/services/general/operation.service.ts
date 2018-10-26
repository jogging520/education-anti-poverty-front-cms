import {Inject, Injectable} from '@angular/core';
import {CommonService} from "@shared/services/general/common.service";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import {Operation} from "@shared/models/general/operation";
import {catchError, flatMap} from "rxjs/operators";
import {Observable} from "rxjs/index";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import * as GeneralConstants from "@shared/constants/general/general-constants";

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(
    private httpClient: _HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private commonService: CommonService
  ) { }

  /**
   * 方法：创建一条业务操作记录
   * @param {string} businessType 业务类型
   * @param {string} serialNo 流水号
   * @return {Observable<Operation>} 创建的操作记录流
   */
  public createOperation(businessType: string, serialNo?: string): Observable<Operation> {

    const tokenData = this.tokenService.get();
    let id: string = '';

    if (serialNo)
      id = serialNo;
    else
      id = this.commonService.setSerialNo();

    let operation: Operation = {
      id: id,
      type: GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_OPERATION_TYPE,
      appType: `${environment.appType}`,
      category: `${environment.category}`,
      user: tokenData.user,
      session: tokenData.session,
      businessType: businessType,
      createTime: new Date(),
      timestamp: new Date(),
      status: GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_OPERATION_STATUS_ACTIVE,
      description: GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_OPERATION_DESCRIPTION
    };

    return this.httpClient
      .post(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_OPERATION}`,
        operation
        )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      );
  }


  /**
   * 方法：查询操作记录
   * @param {Object} conditions 条件（用户、开始时间、结束时间）
   * @return {Observable<Operation>} 操作记录
   */
  public queryOperations(conditions?: Object): Observable<Operation> {
    return this.httpClient
      .get(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_OPERATION}`,
        conditions
        )
      .pipe(
        flatMap((operations: Operation[]) => operations),
        catchError(error => this.commonService.handleError(error))
      )
  }
}
