import {Injectable} from '@angular/core';
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {CommonService} from "@shared/services/general/common.service";
import {_HttpClient} from "@delon/theme";
import {Observable} from "rxjs/index";
import {environment} from "@env/environment";
import {catchError, map} from "rxjs/internal/operators";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private httpClient: _HttpClient,
    private domSanitizer: DomSanitizer,
    private commonService: CommonService
  ) { }

  /**
   * 方法：根据url传调用图片的数据流
   * @param {string} pictureUri 图片的location
   * @return {Observable<any>} 图片的数据流
   */
  public getPicture(pictureUri: string): Observable<any> {
    return this.httpClient
      .get(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_PICTURE}/${pictureUri}`,
        null,
        { responseType: GeneralConstants.CONSTANT_COMMON_HTTP_RESPONSE_TYPE_BLOB })
      .pipe(
        map(e => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e))),
        catchError(error => this.commonService.handleError(error))
      );
  }

  /**
   * 方法：获取图片的Url地址
   * @return {string} 图片的Url地址
   */
  public getPictureUrl(): string {
    return `${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_STORAGE}?${GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_STORAGE_TYPE_PICTURE}`;
  }
}
