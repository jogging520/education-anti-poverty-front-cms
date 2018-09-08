import {Injectable} from '@angular/core';
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

  get(picture: string): void {
    this.httpClient
      .get(`http://223.105.5.116:9090/pictures/${picture}?width=300&height=300`)
      .pipe()
      .subscribe();
  }
}
