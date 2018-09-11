import {Inject, Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {SessionService} from "@shared/services/general/session.service";
import {take} from 'rxjs/operators';
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {distinctUntilChanged} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(
    private router: Router,
    private sessionService: SessionService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.tokenService.get() && this.tokenService.get().token) {
      return true;
    }

    this.router.navigate([GeneralConstants.CONSTANT_COMMON_ROUTE_LOGIN]).catch();
    return false;
  }
}
