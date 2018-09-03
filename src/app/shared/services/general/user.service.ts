import { Injectable } from '@angular/core';
import {CommonService} from "@shared/services/general/common.service";
import {_HttpClient} from "@delon/theme";
import {Observable} from "rxjs/index";
import {User} from "@shared/models/general/user";
import {environment} from "@env/environment";
import {catchError} from "rxjs/operators";
import * as GeneralConstants from "@shared/constants/general/general-constants";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: _HttpClient,
    private commonService: CommonService
  ) { }

  /**
   * 方法：获取全量用户信息
   * @param {string} id 用户ID编号
   * @param {string} name 用户名称
   * @return {Observable<User[]>} 查询到的数据流
   */
  public queryUsers(id?: string, name?: string): Observable<User[]> {
    return this.httpClient
      .get(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_USER}`,
        this.commonService.setParams({id: id, name: name}),
        {headers: CommonService.setHeaders()}
        )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      );
  }
}
