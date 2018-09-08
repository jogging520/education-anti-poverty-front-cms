import { Injectable } from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import {Observable} from "rxjs/index";
import {catchError, map, flatMap} from "rxjs/operators";
import {Organization} from "@shared/models/general/organization";
import {Region} from "@shared/models/general/region";
import {CommonService} from "@shared/services/general/common.service";
import * as GeneralConstants from "@shared/constants/general/general-constants";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(
    private httpClient: _HttpClient,
    private commonService: CommonService
  ) { }

  /**
   * 方法：查询组织机构数据
   * @return {Observable<Organization>} 组织机构数据流
   */
  public queryOrganizations(): Observable<Organization> {
    return this.httpClient.get(
      `${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_ORGANIZATION}`
    )
      .pipe(
        flatMap((organizations: Organization[]) => organizations),
        catchError(error => this.commonService.handleError(error))
      );
  }

  /**
   * 方法：查询区域信息
   * @return {Observable<Region>} 区域数据流
   */
  public queryRegions(): Observable<Region> {
    return this.httpClient.get(
      `${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_REGION}`
    )
      .pipe(
        flatMap((regions: Region[]) => regions),
        catchError(error => this.commonService.handleError(error))
      );
  }
}
