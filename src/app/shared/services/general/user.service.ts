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
   * @return {Observable<User>}
   */
  public queryUsers(): Observable<User[]> {
    return this.httpClient
      .get(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_USER}`,
        this.commonService.setParams({}),
        {headers: CommonService.setHeaders()}
        )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      );
  }
}
