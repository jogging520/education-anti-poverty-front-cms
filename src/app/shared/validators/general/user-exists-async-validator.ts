import {UserService} from "@shared/services/general/user.service";
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {Observable} from "rxjs/index";
import {timer} from "rxjs";
import {catchError, map, tap, switchMap} from "rxjs/internal/operators";
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {CommonService} from "@shared/services/general/common.service";

export function existingUserAsyncValidator(commonService: CommonService,
                                           userService: UserService): AsyncValidatorFn {

  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    let encryptedUserName = encodeURIComponent(
      commonService.encrypt(btoa(control.value), false));

    return timer(GeneralConstants.CONSTANT_MODULE_SHARED_VALIDATOR_USER_EXIST_DE_BOUNCE_TIME)
      .pipe(
        switchMap(() => {
          return userService
            .queryUsers(encryptedUserName)
            .pipe(
              tap(),
              map(users => {
                return (users && users.length > 0) ? {userExists: true} : null;
              }),
              catchError(error => commonService.handleError(error))
            );
        })
      );
  };
}
