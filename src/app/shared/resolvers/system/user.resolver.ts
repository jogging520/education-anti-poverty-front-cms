import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {CommonService} from "@shared/services/general/common.service";
import {UserService} from "@shared/services/general/user.service";
import {Observable} from "rxjs/index";
import {catchError, map} from "rxjs/operators";
import {User} from "@shared/models/general/user";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any> {

  constructor(
    private commonService: CommonService,
    private userService: UserService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    let users: User[] = [];

    return this.userService
      .queryUsers()
      .pipe(map(data => {
          let originalUsers: User[] = data;

          originalUsers.forEach((user: User) => {
            if (user.status === 'SUCCESS') {
              user.realName = decodeURIComponent(escape(atob(this.commonService.decrypt(user.realName))));
              users.push(user);
            }
          })

          return users;
        }),
        catchError(error => this.commonService.handleError(error)));

  }
}
