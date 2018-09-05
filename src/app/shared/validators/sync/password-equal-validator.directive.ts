import {Directive, forwardRef} from '@angular/core';
import {AsyncValidator, FormGroup, NG_VALIDATORS, ValidationErrors} from "@angular/forms";

@Directive({
  selector: '[nb-validatePasswordEqual]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordEqualValidatorDirective),
      multi: true
    }
  ]
})
export class PasswordEqualValidatorDirective implements AsyncValidator {

  constructor() { }

  validate(passwordFormGroup: FormGroup): ValidationErrors | any {
    let password = passwordFormGroup.controls.password.value;
    let confirmPassword = passwordFormGroup.controls.confirmPassword.value;

    return (password === confirmPassword) ? null : {equal: false};
  }

}
