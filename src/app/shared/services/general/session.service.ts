import {Inject, Injectable, OnDestroy} from '@angular/core';
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
import {CacheService} from "@delon/cache";
import {defaultIfEmpty} from "rxjs/internal/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {

  //激活时间定时器
  private idleInterval: any;
  //token定时器
  private heartbeatInterval: any;

  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private httpClient: _HttpClient,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private settingService: SettingsService,
    private cacheService: CacheService,
    private commonService: CommonService,
    private userService: UserService,
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
                  email: user.email});

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

  /**
   * 方法：计算idle时间（根据激活的时间和当前时间的时间差判断，是否跳转到登录页面）
   * 激活时间是在startup（包括登录）后做初始化更新，然后通过指令方式在每一个layout中定期更新
   */
  public idle(): void {
    this.idleInterval = setInterval(() => {
      this.cacheService
        .get(GeneralConstants.CONSTANT_COMMON_CACHE_ACTIVE_TIME)
        .pipe(
          defaultIfEmpty(() => {
            clearInterval(this.idleInterval)
          })
        )
        .subscribe((activeTime) => {
          const currentTime = new Date().getTime();

          if (currentTime - Number(activeTime) > GeneralConstants.CONSTANT_COMMON_IDLE_NO_INTERACTIVE_TIME) {
            this.router.navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
          }
        })
    }, GeneralConstants.CONSTANT_COMMON_IDLE_INTERVAL);
  }

  /**
   * 方法：心跳（与服务端的心跳，更换最新令牌）
   */
  public heartbeat(): void {

    const tokenData = this.tokenService.get();
    if (!tokenData || !tokenData.token) {
      clearInterval(this.heartbeatInterval);
      return;
    }

    this.heartbeatInterval = setInterval(() => {
      this.httpClient
        .put(`${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_SESSION}`)
        .pipe()
        .subscribe((token: Token) => {
          console.log(token);

          this.tokenService.set({
            session: token.session,
            user: token.user,
            loginTime: new Date().getTime(),
            lifeTime: token.lifeTime,
            token: token.jwt,
            downPublicKey: token.downPublicKey,
            upPrivateKey: token.upPrivateKey,
            roles: this.tokenService.get().roles,
            permissions: this.tokenService.get().permissions,
            affiliations: this.tokenService.get().affiliations
          });

        });
    }, GeneralConstants.CONSTANT_COMMON_HEART_BEAT_INTERVAL)
  }

  /**
   * 方法：清理定时器
   */
  public clearIntervals(): void {
    clearInterval(this.idleInterval);
    clearInterval(this.heartbeatInterval);
  }


  /**
   * 方法：销毁的时候要清理掉定时器
   */
  ngOnDestroy(): void {
    this.clearIntervals();
  }

}
