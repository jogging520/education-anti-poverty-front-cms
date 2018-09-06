import {Inject, Injectable} from '@angular/core';
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {CommonService} from "@shared/services/general/common.service";
import {_HttpClient} from "@delon/theme";
import {Observable} from "rxjs/index";
import {environment} from "@env/environment";
import {catchError} from "rxjs/internal/operators";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private httpClient: _HttpClient,
    private http: HttpClient,
    private commonService: CommonService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { }

  public getUploadFileUrl(): string {
    let tokenData = this.tokenService.get();

    return `${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_STORAGE}?serialNo=1111&type=avatar&category=${environment.category}&apiKey=${environment.apiKey}&session=${tokenData.session}&user=${tokenData.user}&appType=${environment.appType}`;
  }

  public uploadFile(file: File): Observable<any> {
    let formData: FormData = new FormData();

    formData.append('file', file);

    let tokenData = this.tokenService.get();

    let httpParams: HttpParams = new HttpParams;
    httpParams.append('serialNo', '1111');
    httpParams.append('appType', 'cms');
    httpParams.append('category', 'GansuProvincialEducationDepartment');
    httpParams.append('session', tokenData.session);
    httpParams.append('user', tokenData.user);

    console.log(httpParams);

    let headers = {};

    if (`${environment.contentType}`) {
      headers[GeneralConstants.CONSTANT_COMMON_HTTP_HEADER_CONTENT_TYPE] = `multipart/form-data`;
    }

    if (`${environment.accept}`) {
      headers[GeneralConstants.CONSTANT_COMMON_HTTP_HEADER_ACCEPT] = `${environment.accept}`;
    }

    if (`${environment.apiKey}`) {
      headers[GeneralConstants.CONSTANT_COMMON_HTTP_HEADER_API_KEY] = `${environment.apiKey}`;
    }

    const req = new HttpRequest('POST', `${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_STORAGE}?serialNo=1111&type=avatar&category=${environment.category}&apiKey=${environment.apiKey}&session=${tokenData.session}&user=${tokenData.user}&appType=${environment.appType}`,
      formData, {headers: new HttpHeaders(headers),
        reportProgress: true,
        responseType: 'text'});

    return this.http.request(req);

    // return this.httpClient
    //   .post(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_STORAGE}`,
    //     formData,
    //     this.commonService.setParams({}),
    //     {headers: CommonService.setHeaders()}
    //   )
    //   .pipe(
    //     catchError(error => this.commonService.handleError(error))
    //   );
  }
}
