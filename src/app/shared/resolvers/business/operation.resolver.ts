import {Inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {StrategyService} from "@shared/services/general/strategy.service";
import {Observable} from "rxjs/index";
import {UserService} from "@shared/services/general/user.service";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {forkJoin} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {Strategy} from "@shared/models/general/strategy";
import {User} from "@shared/models/general/user";
import {CommonService} from "@shared/services/general/common.service";

@Injectable({
  providedIn: 'root'
})
export class OperationResolver implements Resolve<any> {

  constructor(@Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              private commonService: CommonService,
              private strategyService: StrategyService,
              private userService: UserService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    const tokenData = this.tokenService.get();

    return forkJoin(
      this.strategyService.queryStrategies(['appTypes', 'businessTypes']),
      this.userService.queryUsers()
    )
      .pipe(
        map((data) => {
          let strategies: Strategy[] =  data[0];
          let originalUsers: User[] = data[1];
          let originalAppTypes: Strategy;
          let originalBusinessTypes: Strategy;
          let operationParams = {channelTypes: [], businessTypes: [], users: []};

          strategies.forEach((strategy) => {
            if (strategy.type === 'appTypes') {
              originalAppTypes = strategy;
            }

            if (strategy.type === 'businessTypes') {
              originalBusinessTypes = strategy;
            }
          });

          if (originalAppTypes && originalAppTypes.status === 'ACTIVE' && originalAppTypes.parameters) {
            Object.keys(originalAppTypes.parameters)
              .forEach((key) => {
                if (originalAppTypes.parameters[key])
                  operationParams.channelTypes.push({'text': originalAppTypes.parameters[key], 'value': key});
              });
          }

          if (originalBusinessTypes && originalBusinessTypes.status === 'ACTIVE' && originalBusinessTypes.parameters) {
            Object.keys(originalBusinessTypes.parameters)
              .forEach((key) => {
                if (originalBusinessTypes.parameters[key])
                  operationParams.businessTypes.push({'text': originalBusinessTypes.parameters[key], 'value': key});
              });
          }

          if (originalUsers) {
            originalUsers.forEach((user: User) => {
              if (user.status === 'ACTIVE') {
                operationParams.users.push({'text': decodeURIComponent(escape(atob(this.commonService.decrypt(user.realName)))), 'value': user.id});
              }
            });
          }

          if (tokenData.roles && tokenData.roles.indexOf('admin') > -1) {
            operationParams.users.push({'text': '全部', 'value': 'ffffffffffffffffffffffff'});
          }

          return operationParams;
        }),
        catchError(error => this.commonService.handleError(error))
      );
  }

}
