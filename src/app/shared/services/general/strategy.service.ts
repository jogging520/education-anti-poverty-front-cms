import { Injectable } from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {CommonService} from "@shared/services/general/common.service";
import {Observable} from "rxjs/index";
import {Strategy} from "@shared/models/general/strategy";
import {environment} from "@env/environment";
import {catchError, flatMap} from "rxjs/operators";

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
   * @param {string} type 类型
   * @return {Observable<Strategy>} 策略数据流
   */
  public queryStrategies(type: string): Observable<Strategy> {
    return this.httpClient
      .get(`${environment.serverUrl}strategies\\${type}`,
        this.commonService.setParams({}),
        {headers: CommonService.setHeaders()}
        )
      .pipe(
        flatMap((strategy: any) => strategy),
        catchError(error => this.commonService.handleError(error))
      );
  }
}
