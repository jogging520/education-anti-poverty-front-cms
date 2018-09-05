import {Inject, Injectable} from '@angular/core';
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {CommonService} from "@shared/services/general/common.service";
import {_HttpClient} from "@delon/theme";
import {Observable} from "rxjs/index";
import {environment} from "@env/environment";
import {catchError} from "rxjs/internal/operators";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private httpClient: _HttpClient,
    private commonService: CommonService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { }

  public getUploadFileUrl(): string {
    let tokenData = this.tokenService.get();

    return `${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_STORAGE}?serialNo=1111&type=avatar&category=${environment.category}&apiKey=${environment.apiKey}&session=${tokenData.session}&user=${tokenData.user}&appType=${environment.appType}`;
  }

  public uploadFile(): Observable<any> {
    return this.httpClient
      .post(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_STORAGE}`,
        this.commonService.setParams({name: name}),
        {headers: CommonService.setHeaders()}
      )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      );
  }
}
