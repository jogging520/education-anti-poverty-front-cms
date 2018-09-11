import {Directive, Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_VALIDATORS, ValidationErrors} from "@angular/forms";
import {UserService} from "@shared/services/general/user.service";
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {CommonService} from "@shared/services/general/common.service";
import {
  catchError, debounceTime, delay, distinct, distinctUntilChanged, distinctUntilKeyChanged,
  tap, flatMap, map, filter, first, take
} from "rxjs/internal/operators";
import {Observable, of} from "rxjs/index";
import {User} from "@shared/models/general/user";


@Injectable({ providedIn: 'root' })
export class UserExistsSyncValidatorDirective implements AsyncValidator {

  preValue: string = '';
  isUserExisted: boolean = false;

  constructor(private userService: UserService,
              private commonService: CommonService) { }

  validate(formControl: AbstractControl):
    Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {

    console.log('-----');
    return formControl
      .valueChanges
      .pipe(
        debounceTime(GeneralConstants.CONSTANT_MODULE_SHARED_VALIDATOR_USER_EXIST_DE_BOUNCE_TIME),
        filter((value) => value !== this.preValue),
        map((value) => {
          console.log(value);

          this.preValue = value;

          let encryptedUserName = encodeURIComponent(
            this.commonService.encrypt(btoa(value), false));

          this.userService
            .queryUsers(encryptedUserName)
            .pipe(
              tap(),
              flatMap(user => user)
            )
            .subscribe((user: User) => {
                if (atob(this.commonService.decrypt(user.name)) === this.preValue &&
                  user.status === GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_USER_STATUS_ACTIVE) {
                  console.log('---------');
                  this.isUserExisted = true;
                  //return {userExisted: this.isUserExisted};
                }

                return null;
              },
              (error) => {catchError(error => this.commonService.handleError(error))},
              () => {
                console.log('---------');
                //return {userExisted: this.isUserExisted};
              }
            )
        }),
        catchError(error => this.commonService.handleError(error))
      )

  }

}
