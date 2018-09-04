import {UserService} from "@shared/services/general/user.service";
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {Observable, pipe} from "rxjs/index";
import {catchError, debounceTime, distinctUntilChanged, map, tap, flatMap} from "rxjs/internal/operators";
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {CommonService} from "@shared/services/general/common.service";
import {User} from "@shared/models/general/user";

export function existingUserValidator(commonService: CommonService,
                                      userService: UserService): AsyncValidatorFn {

  let isUserExisted: boolean = false;

  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control
      .valueChanges
      .pipe(
        debounceTime(GeneralConstants.CONSTANT_MODULE_SHARED_VALIDATOR_USER_EXIST_DE_BOUNCE_TIME),
        distinctUntilChanged(),
        map((value) => {
          console.log(value);
          let encryptedUserName = encodeURIComponent(
            commonService.encrypt(btoa(value), false));

          return userService
            .queryUsers(null, encryptedUserName)
            .pipe(
              tap(),
              flatMap(user => {
                if (user) {
                  return user;
                }

                let newUser = new User();
                newUser.status(GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_USER_STATUS_NOT_EXISTS);

                return newUser;
              })
            )
            .subscribe((user: User) => {

                console.log(user);
                if (user.status === GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_USER_STATUS_ACTIVE) {
                  isUserExisted = true;
                }
              },
              (error) => {catchError(error => this.commonService.handleError(error))},
              () => {
                return {userExisted: isUserExisted}
              }
            )
        }),
        catchError(error => this.commonService.handleError(error))
      )
  }
}
