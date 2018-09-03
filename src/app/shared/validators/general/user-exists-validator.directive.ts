import { Directive } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";
import {UserService} from "@shared/services/general/user.service";
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {CommonService} from "@shared/services/general/common.service";
import {
  catchError, debounceTime, delay, distinct, distinctUntilChanged, distinctUntilKeyChanged,
  tap, flatMap, map, filter, first, take
} from "rxjs/internal/operators";
import {of} from "rxjs/index";
import {User} from "@shared/models/general/user";


@Directive({
  selector: '[userExistsValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: UserExistsValidatorDirective, multi: true}]
})
export class UserExistsValidatorDirective implements Validator {

  preValue: string = '';
  isUserExisted: boolean = false;

  constructor(private userService: UserService,
              private commonService: CommonService) { }

  validate(formControl: AbstractControl): ValidationErrors | null {
    formControl
      .valueChanges
      .pipe(
        debounceTime(GeneralConstants.CONSTANT_MODULE_SHARED_VALIDATOR_USER_EXIST_DE_BOUNCE_TIME),
        filter((value) => value !== this.preValue))
      .subscribe((value) => {
          this.preValue = value;

          let encryptedUserName = encodeURIComponent(
            this.commonService.encrypt(btoa(value), false));

          this.userService
            .queryUsers(null, encryptedUserName)
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
              },
              (error) => {catchError(error => this.commonService.handleError(error))},
              () => {
                console.log('---------');
                //return {userExisted: this.isUserExisted};
              }
            )
        },
        (error) => {catchError(error => this.commonService.handleError(error))},
        () => {})

    return null;

    //return {userExisted: this.isUserExisted};

    // return control.valueChanges
    //   .pipe(
    //     tap(() => console.log(control.value)),
    //
    //     debounceTime(GeneralConstants.CONSTANT_MODULE_SHARED_VALIDATOR_USER_EXIST_DE_BOUNCE_TIME),
    //     distinctUntilChanged(),
    //     //first(),
    //     //take(1),
    //     catchError(error => this.commonService.handleError(error))
    //   )
    //   .subscribe((value) => {
    //   console.log(value)
    //     },
    //     () => {catchError(error => this.commonService.handleError(error))},
    //     () => {
    //   console.log('---------');
    //       this.userService
    //         .queryUsers()
    //         .pipe(
    //           catchError(error => this.commonService.handleError(error))
    //         );
    //     });

  }

}
