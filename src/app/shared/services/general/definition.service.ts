import {Injectable, OnInit} from '@angular/core';
import {CacheService} from "@delon/cache";
import * as GeneralConstants from "@shared/constants/general/general-constants";

@Injectable({
  providedIn: 'root'
})
export class DefinitionService implements OnInit {

  errorCodes = {};

  constructor(
    private cacheService: CacheService
  ) { }

  ngOnInit(): void {
    this.cacheService
      .get<object>(GeneralConstants.CONSTANT_COMMON_CACHE_ERROR_CODE)
      .subscribe((errorCodes) => {
        this.errorCodes = errorCodes;
      });
  }

  /**
   * 方法：根据错误编码获取错误描述
   * @param {string} errorCode 错误码
   * @return {string} 错误描述
   */
  public getErrorDescription(errorCode: string): string | null {
    return this.errorCodes[errorCode];
  }
}
