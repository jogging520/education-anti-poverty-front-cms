import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {SessionService} from "@shared/services/general/session.service";

@Directive({
  selector: '[showAuthed]'
})
export class ShowAuthedDirective {

  condition: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private sessionService: SessionService,
    private router: Router
  ) { }

  /**
   * 如果没有登录（认证成功）并且符合condition条件时，那么清理当前的容器页面，同时路由到登录页面。
   */
  ngOnInit(): void {
    this.sessionService
      .isAuthenticated
      .subscribe(
        isAuthenticated => {
          if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainer.clear();
            this.router.navigate(['/passport/login']).catch();
          }
        }
      );
  }

  @Input() set showAuthed(condition: boolean) {
    this.condition = condition;
  }
}
