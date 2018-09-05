import { Injectable } from '@angular/core';
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {CommonService} from "@shared/services/general/common.service";
import {_HttpClient} from "@delon/theme";
import {Observable} from "rxjs/index";
import {environment} from "@env/environment";
import {catchError} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private httpClient: _HttpClient,
    private commonService: CommonService
  ) { }


  public uploadFile(): Observable<any> {
    return this.httpClient
      .get(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_STORAGE}`,
        this.commonService.setParams({name: name}),
        {headers: CommonService.setHeaders()}
      )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      );
  }
}
