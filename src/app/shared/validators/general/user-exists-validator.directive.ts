import { Directive } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validators} from "@angular/forms";
import {Observable, throwError} from "rxjs/index";
import {UserService} from "@shared/services/general/user.service";
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {flatMap, catchError, debounceTime, distinctUntilChanged} from "rxjs/operators";
import {CommonService} from "@shared/services/general/common.service";

@Directive({
  selector: '[userExistsValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: UserExistsValidatorDirective, multi: true}]
})
export class UserExistsValidatorDirective implements Validators {

  constructor(private userService: UserService,
              private commonService: CommonService) { }

  validate(control: AbstractControl): Observable<any> {
    return control.valueChanges
      .pipe(
        debounceTime(GeneralConstants.CONSTANT_MODULE_SHARED_VALIDATOR_USER_EXIST_DE_BOUNCE_TIME),
        distinctUntilChanged(),
        flatMap(() => {
          if (!control.value) {
            return throwError({ 'msg': 'required' });
          }

          return this.userService
            .queryUsers()
            .pipe(
              catchError(error => this.commonService.handleError(error))
            );
        }),
        catchError(error => this.commonService.handleError(error))
      )

  }

}
