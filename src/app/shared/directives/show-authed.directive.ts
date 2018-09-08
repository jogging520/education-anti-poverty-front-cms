import {Directive, Inject, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {SessionService} from "@shared/services/general/session.service";
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import * as GeneralConstants from "@shared/constants/general/general-constants";

@Directive({
  selector: '[nb-showAuthed]'
})
export class ShowAuthedDirective {

  //判断条件：true为认证，false为非认证
  condition: boolean = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private router: Router,
    private sessionService: SessionService
  ) { }

  /**
   * 如果没有登录（认证成功）并且符合condition条件时，那么清理当前的容器页面，同时路由到登录页面。
   */
  ngOnInit(): void {

    const tokenData = this.tokenService.get();

    if (!tokenData.token && this.condition) {
      this.router.navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
    }

    this.sessionService
      .isAuthenticated
      .subscribe(
        isAuthenticated => {

          if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainer.clear();
            this.router.navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
          }
        }
      );
  }
}
