import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserCreationStepService} from "../../service/user-creation-step.service";
import {existingUserValidator} from "@shared/validators/async/user-exists-validator";
import {CommonService} from "@shared/services/general/common.service";
import {UserService} from "@shared/services/general/user.service";

@Component({
  selector: 'app-user-creation-basic-step',
  templateUrl: './user-creation-basic-step.component.html',
  styles: []
})
export class UserCreationBasicStepComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public item: UserCreationStepService,
              private commonService: CommonService,
              private userService: UserService
              ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: [
        null, Validators.compose([Validators.required, Validators.minLength(8)])
      ],
      realName: [
        null, Validators.compose([Validators.required, Validators.minLength(2)])
      ],
      nb: [
        null,  [Validators.required, Validators.minLength(6)],
          [existingUserValidator(this.commonService, this.userService)],
      ],
      pay_account: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      receiver_type: [null, [Validators.required]],
      receiver_account: [null, [Validators.required]],
      receiver_name: [
        null,
        Validators.compose([Validators.required, Validators.minLength(2)]),
      ],
      amount: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(`[0-9]+`),
          Validators.min(1),
          Validators.max(10000 * 100),
        ]),
      ],
    });
    this.formGroup.patchValue(this.item, {onlySelf: true, emitEvent: true});

    // this.formGroup.controls['nb']
    //   .valueChanges
    //   .pipe(
    //     //tap((value) => console.log(value)),
    //
    //     debounceTime(2000),
    //     distinctUntilChanged(),)
    //   .subscribe((data) => {
    //   console.log(data);
    //   })
  }

  get name() {
    return this.formGroup.controls['name'];
  }

  get realName() {
    return this.formGroup.controls['realName'];
  }

  get pay_account() {
    return this.formGroup.controls['pay_account'];
  }
  get receiver_type() {
    return this.formGroup.controls['receiver_type'];
  }
  get receiver_account() {
    return this.formGroup.controls['receiver_account'];
  }
  get receiver_name() {
    return this.formGroup.controls['receiver_name'];
  }
  get amount() {
    return this.formGroup.controls['amount'];
  }

  get nb() {
    return this.formGroup.controls['nb'];
  }

  private submit(): void {

  }

  private printError() {
    console.log(this.formGroup.controls);
  }
}
