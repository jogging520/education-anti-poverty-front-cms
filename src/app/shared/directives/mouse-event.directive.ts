import {Directive, HostListener} from '@angular/core';
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {CacheService} from "@delon/cache";

@Directive({
  selector: '[nb-mouseEvent]'
})
export class MouseEventDirective {

  constructor(
    private cacheService: CacheService
  ) { }

  @HostListener(GeneralConstants.CONSTANT_COMMON_LISTEN_MOUSE_EVENT,
    [GeneralConstants.CONSTANT_COMMON_LISTEN_EVENT_MOUSE_ARGUMENTS])
  public eventListen(event: any): void
  {
    this.cacheService
      .set(GeneralConstants.CONSTANT_COMMON_CACHE_ACTIVE_TIME, new Date().getTime());
  }

}
