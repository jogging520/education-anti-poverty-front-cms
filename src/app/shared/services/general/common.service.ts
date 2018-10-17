import {Inject, Injectable} from '@angular/core';
import {CacheService} from "@delon/cache";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";
import {Observable, throwError} from "rxjs/index";
import {HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest} from "@angular/common/http";
import {environment} from "@env/environment";
import { v4 as uuid } from 'uuid';
import {ACLService} from "@delon/acl";
import {MenuService} from "@delon/theme";
import {ReuseTabService} from "@delon/abc";
import * as GeneralConstants from "@shared/constants/general/general-constants";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public messageService: NzMessageService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private cacheService: CacheService,
    private aclService: ACLService,
    private menuService: MenuService,
    private reuseTabService: ReuseTabService
  ) {}

  /**
   * 方法：设置http请求header部分
   * @param {HttpRequest} httpRequest http请求体
   * @return {HttpHeaders} http请求头
   */
  public setHeaders(httpRequest: HttpRequest<any>): HttpHeaders {

    let headers = {};

    if (`${environment.contentType}` && httpRequest.url.indexOf(GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_STORAGE) == -1) {
      headers[GeneralConstants.CONSTANT_COMMON_HTTP_HEADER_CONTENT_TYPE] = `${environment.contentType}`;
    }

    if (`${environment.accept}`) {
      headers[GeneralConstants.CONSTANT_COMMON_HTTP_HEADER_ACCEPT] = `${environment.accept}`;
    }

    if (`${environment.apiKey}`) {
      headers[GeneralConstants.CONSTANT_COMMON_HTTP_HEADER_API_KEY] = `${environment.apiKey}`;
    }

    let tokenData = this.tokenService.get();

    if (tokenData && tokenData.token) {
      headers[GeneralConstants.CONSTANT_COMMON_HTTP_PARAM_PUBLIC_TOKEN] = tokenData.token;
    }

    return new HttpHeaders(headers);

  }

  /**
   * 方法：根据token中保存的公共信息，形成params对象
   * @param {HttpRequest} httpRequest http请求体
   * @return {HttpParams} 增加了公共信息后的Http参数对象
   */
  public setParams(httpRequest: HttpRequest<any>): HttpParams {

    let httpParams: HttpParams = new HttpParams();

    if (this.getSerialNo()) {
      httpParams = httpParams.append(GeneralConstants.CONSTANT_COMMON_HTTP_PARAM_PUBLIC_SERIAL_NO, this.getSerialNo());
    }

    if (`${environment.appType}`) {
      httpParams = httpParams.append(GeneralConstants.CONSTANT_COMMON_HTTP_PARAM_PUBLIC_APP_TYPE, `${environment.appType}`);
    }

    if (`${environment.category}`) {
      httpParams = httpParams.append(GeneralConstants.CONSTANT_COMMON_HTTP_PARAM_PUBLIC_CATEGORY, `${environment.category}`);
    }

    let tokenData = this.tokenService.get();

    if (tokenData && tokenData.session) {
      httpParams = httpParams.append(GeneralConstants.CONSTANT_COMMON_HTTP_PARAM_PUBLIC_SESSION, tokenData.session);
    }

    if (tokenData && tokenData.user) {
      httpParams = httpParams.append(GeneralConstants.CONSTANT_COMMON_HTTP_PARAM_PUBLIC_USER, tokenData.user);
    }

    if (httpRequest.params) {
      httpRequest.params.keys()
        .forEach((key) => {
          if (httpRequest.params.get(key))
            httpParams = httpParams.append(key, httpRequest.params.get(key));
        });
    }

    return httpParams;

  }

  /**
   * 方法：错误处理
   * @param {HttpErrorResponse} error http响应报文截获的错误信息
   * @return {Observable<any>} 错误信息流
   */
  public handleError(error: HttpErrorResponse): Observable<any> {

    switch (error.status) {
      case 200:
        break;
      case 401:
        this.router.navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
        break;
      case 500:
        console.warn(GeneralConstants.CONSTANT_COMMON_INTERNAL_SERVER_ERROR, error);
        this.messageService.error(GeneralConstants.CONSTANT_COMMON_INTERNAL_SERVER_ERROR);
        this.router.navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_INTERNAL_SERVER_ERROR]).catch();
        break;
      default:
        console.warn(GeneralConstants.CONSTANT_COMMON_DEFAULT_ERROR, error);
        this.messageService.error(GeneralConstants.CONSTANT_COMMON_DEFAULT_ERROR);
        break;
    }

    return throwError(error);

  }

  /**
   * 方法：生成业务流水号
   * @returns {string} 新生成的流水号
   */
  public setSerialNo(): string {

    let serialNo = uuid();

    this.cacheService
      .set(GeneralConstants.CONSTANT_COMMON_CACHE_SERIAL_NO, serialNo);

    return serialNo;

  }

  /**
   * 获取当前流水号
   * @returns {string} 当前流水号
   */
  public getSerialNo(): string {

    let serialNo = '';

    this.cacheService
      .get<string>(GeneralConstants.CONSTANT_COMMON_CACHE_SERIAL_NO)
      .subscribe(data => serialNo = data);

    return serialNo;

  }

  /**
   * 方法：加密（RSA）
   * @param {string} content 明文
   * @param {boolean} isTemporary 是否为临时密钥
   * @returns {string} 密文
   */
  public encrypt(content: string, isTemporary: boolean): string|any {

    let jsEncrypt = new JSEncrypt();

    if (isTemporary) {
      jsEncrypt.setPublicKey(`${environment.temporaryPublicKey}`);
    } else {
      if (!this.tokenService.get() || !this.tokenService.get().downPublicKey)
        return false;

      jsEncrypt.setPublicKey(this.tokenService.get().downPublicKey);
    }

    return jsEncrypt.encrypt(content);

  }

  /**
   * 方法：解密
   * @param {string} content 密文
   * @returns {string | any} 明文
   */
   public decrypt(content: string): string|any  {

    let jsEncrypt: JSEncrypt = new JSEncrypt();

    if (!this.tokenService.get() || !this.tokenService.get().upPrivateKey)
      return false;

    jsEncrypt.setPrivateKey(this.tokenService.get().upPrivateKey);

    return jsEncrypt.decrypt(content);

  }

  /**
   * 方法：获取当前时间的值
   * @return {number} 当前时间
   */
  public static currentDate(): number {
     return new Date().getTime();
  }

  /**
   * 方法：获取前一天时间的值
   * @return {number} 前一天时间
   */
  public static beforeDate(): number {
     return new Date().getTime() - GeneralConstants.CONSTANT_COMMON_YESTERDAY_MICRO_SECOND;
  }

  /**
   * 方法：清理各类缓存数据，包括：tab页、token、权限、菜单等数据。
   */
  public clear(): void {
    this.reuseTabService.clear();
    this.tokenService.clear();
    this.aclService.removeAbility(this.aclService.data.abilities);
    this.aclService.removeRole(this.aclService.data.roles);
    this.menuService.clear();
  }

  /**
   * 方法：处理重用tab页面的排除项，这些页面不会在重用页面中展示。
   */
  public handleReuseTabExclude(): void {
    let excludes: RegExp[] = [];

    excludes.push(new RegExp(GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_LOGIN));
    excludes.push(new RegExp(GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_REGISTER));
    excludes.push(new RegExp(GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_LOCK));
    excludes.push(new RegExp(GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_FORBIDDEN));
    excludes.push(new RegExp(GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_NOT_FOUND));
    excludes.push(new RegExp(GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_SERVER_INTERNAL_ERROR));
    excludes.push(new RegExp(GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_CALL_BACK));

    this.reuseTabService.excludes = excludes;
  }
}
