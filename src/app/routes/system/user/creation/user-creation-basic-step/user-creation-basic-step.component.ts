import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserCreationStepService} from "@shared/services/step/user-creation-step.service";

@Component({
  selector: 'app-user-creation-basic-step',
  templateUrl: './user-creation-basic-step.component.html',
  styles: []
})
export class UserCreationBasicStepComponent implements OnInit {

  types: any[] = [
    {text: '普通', value: 'COMMON'},
    {text: '特殊', value: 'SPECIAL'}
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder,
              public item: UserCreationStepService) { }

  ngOnInit() {
    this.form = this.fb.group({
      type: [
        'COMMON', Validators.compose([Validators.required])
      ],
      name: [
        null, Validators.compose([Validators.required])
      ],
      realName: [
        null, Validators.compose([Validators.required])
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
    this.form.patchValue(this.item);
  }

  get type() {
    return this.form.controls['type'];
  }

  get name() {
    return this.form.controls['name'];
  }

  get realName() {
    return this.form.controls['realName'];
  }

  get pay_account() {
    return this.form.controls['pay_account'];
  }
  get receiver_type() {
    return this.form.controls['receiver_type'];
  }
  get receiver_account() {
    return this.form.controls['receiver_account'];
  }
  get receiver_name() {
    return this.form.controls['receiver_name'];
  }
  get amount() {
    return this.form.controls['amount'];
  }

  private submit(): void {

  }
}
