import { Injectable } from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {CommonService} from "@shared/services/general/common.service";
import {Observable} from "rxjs/index";
import {Strategy} from "@shared/models/general/strategy";
import {environment} from "@env/environment";
import {catchError} from "rxjs/operators";
import * as GeneralConstants from "@shared/constants/general/general-constants";

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  constructor(
    private httpClient: _HttpClient,
    private commonService: CommonService
  ) { }

  /**
   * 方法：获取策略数据
   * @param {string[]} types 类型
   * @return {Observable<Strategy>} 策略数据流
   */
  public queryStrategies(types: string[]): Observable<Strategy[]> {
    return this.httpClient
      .get(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_STRATEGY}`,
        {types: types.join(GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_SEPARATOR)}
        )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      );
  }
}
