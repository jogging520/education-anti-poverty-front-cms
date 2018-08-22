import { Injectable } from '@angular/core';
import {CommonService} from "@shared/services/general/common.service";
import {_HttpClient} from "@delon/theme";
import {Observable} from "rxjs/index";
import {User} from "@shared/models/general/user";
import {environment} from "@env/environment";
import {catchError, flatMap} from "rxjs/operators";

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
  public queryUsers(): Observable<User> {
    return this.httpClient
      .get(`${environment.serverUrl}users`,
        this.commonService.setParams({}),
        {headers: CommonService.setHeaders()}
        )
      .pipe(
        flatMap((strategy: any) => strategy),
        catchError(error => this.commonService.handleError(error))
      );
  }
}
