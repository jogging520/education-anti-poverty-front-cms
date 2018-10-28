import { Injectable } from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {Observable} from "rxjs/index";
import {Policy} from "@shared/models/business/policy";
import {environment} from "@env/environment";
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {CommonService} from "@shared/services/general/common.service";
import {catchError} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(private httpClient: _HttpClient,
              private commonService: CommonService) { }

  public queryPoliciesByName(name: string): Observable<Policy[]> {
    this.commonService.setSerialNo();

    return this.httpClient
      .get(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_POLICY}`,
        {name: name}
        )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      );
  }

}
