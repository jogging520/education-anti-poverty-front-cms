import {Directive, HostListener} from '@angular/core';
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {CacheService} from "@delon/cache";

@Directive({
  selector: '[nb-eventListener]'
})
export class EventListenerDirective {

  constructor(
    private cacheService: CacheService
  ) { }

  /**
   * 方法：监听鼠标事件
   * @param event 鼠标事件
   */
  @HostListener(GeneralConstants.CONSTANT_COMMON_LISTEN_MOUSE_EVENT,
    [GeneralConstants.CONSTANT_COMMON_LISTEN_MOUSE_EVENT_ARGUMENTS])
  public onMouseEvent(event: any): void
  {
    this.setActiveTime();
  }

  /**
   * 方法：监听键盘事件
   * @param event 键盘事件
   */
  @HostListener(GeneralConstants.CONSTANT_COMMON_LISTEN_KEY_EVENT,
    [GeneralConstants.CONSTANT_COMMON_LISTEN_KEY_EVENT_ARGUMENTS])
  public onKeyEvent(event: any): void
  {
    this.setActiveTime();
  }

  /**
   * 方法：设置激活时间为当前时间
   */
  private setActiveTime(): void {
    this.cacheService
      .set(GeneralConstants.CONSTANT_COMMON_CACHE_ACTIVE_TIME, new Date().getTime());
  }

}
