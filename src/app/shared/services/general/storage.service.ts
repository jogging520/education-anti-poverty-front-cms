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

  public getImage(imageUri: string): Observable<any> {
    console.log(imageUri);

    return this.httpClient
      .get(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_PICTURE}/${imageUri}`,
        null,
        { responseType: GeneralConstants.CONSTANT_COMMON_HTTP_RESPONSE_TYPE_BLOB })
      .pipe(
        map(e => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e))),
        catchError(error => this.commonService.handleError(error))
      );
  }
}
