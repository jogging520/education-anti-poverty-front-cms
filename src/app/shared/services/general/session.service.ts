import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject, throwError} from "rxjs/index";
import {User} from "@shared/models/general/user";
import {_HttpClient, SettingsService} from "@delon/theme";
import {CommonService} from "@shared/services/general/common.service";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {mergeMap, catchError, map} from "rxjs/operators";
import {environment} from "@env/environment";
import {Token} from "@shared/models/general/token";
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {UserService} from "@shared/services/general/user.service";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private httpClient: _HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private settingService: SettingsService,
    private commonService: CommonService,
    private userService: UserService
  ) { }

  /**
   * 方法：登录
   * @param {string} userName 用户名
   * @param {string} password 密码
   * @param {string} mobile 手机号码
   * @return {Observable<any>} 登录返回的流
   */
  public login(userName?: string, password?: string, mobile?: string): Observable<any> {

    if (!this.commonService.getSerialNo()) {
      this.commonService.setSerialNo();
    }

    let encryptedUserName = encodeURIComponent(
      this.commonService.encrypt(btoa(userName), true));
    let encryptedPassword = encodeURIComponent(
      this.commonService.encrypt(btoa(password), true));
    let encryptedMobile = encodeURIComponent(
      this.commonService.encrypt(btoa(mobile), true));

    return this.httpClient
      .post(
        `${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_LOGIN}`,
        null,
        {
          userName: encryptedUserName,
          password: encryptedPassword,
          mobile: encryptedMobile})
      .pipe(
        map((token: Token) => {
          if (token.status !== GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_TOKEN_STATUS_SUCCESS) {
            return throwError(new Error(token.status));
          }

          this.tokenService.set({
            token: token.jwt
          });

          return token;
        }),
        mergeMap((token: Token) => {
          if (token.status !== GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_TOKEN_STATUS_SUCCESS) {
            return throwError(new Error(token.status));
          }

          return this.userService.queryUserById(token.user, token.user)
            .pipe(
              map((user: User) => {
                this.tokenService.clear();

                if (user.status !== GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_USER_STATUS_ACTIVE) {
                  return throwError(user.status);
                }

                this.tokenService.set({
                  session: token.session,
                  user: token.user,
                  loginTime: new Date().getTime(),
                  lifeTime: token.lifeTime,
                  token: token.jwt,
                  downPublicKey: token.downPublicKey,
                  upPrivateKey: token.upPrivateKey,
                  roles: user.roles,
                  permissions: user.permissions,
                  affiliations: user.affiliations
                });

                this.settingService.setUser({
                  name: decodeURIComponent(escape(atob(this.commonService.decrypt(user.realName)))),
                  avatar: user.avatar,
                  email: user.emails[0]});

                this.setAuth(user);
              })
            )
        })
      )
  }

  /**
   * 方法：登出
   * @return {Observable<any>} 登出返回的流
   */
  public logout(): Observable<any> {
    return this.httpClient
      .delete(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_SESSION}`
      )
      .pipe(
        map((data) => {
          this.purgeAuth();
          return data;
        }),
        catchError(error => this.commonService.handleError(error))
      );
  }

  /**
   * 方法：设置鉴权信息
   * @param {User} user
   */
  private setAuth(user: User) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * 方法：清理鉴权信息
   */
  private purgeAuth() {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.commonService.clear();
  }
}
