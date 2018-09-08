import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserCreationStepService} from "../../service/user-creation-step.service";
import {existingUserValidator} from "@shared/validators/async/user-exists-validator";
import {CommonService} from "@shared/services/general/common.service";
import {UserService} from "@shared/services/general/user.service";
import {UploadFile} from "ng-zorro-antd";
import {environment} from "@env/environment";
import * as GeneralConstants from "@shared/constants/general/general-constants";
import {StorageService} from "@shared/services/general/storage.service";


@Component({
  selector: 'app-user-creation-basic-step',
  templateUrl: './user-creation-basic-step.component.html',
  styleUrls: ['./user-creation-basic-step.component.less'],
})
export class UserCreationBasicStepComponent implements OnInit {

  previewImage = '';
  previewVisible = false;
  fileList = [];

  formGroup: FormGroup;

  pictureUrl: string = '';
  storedPicture: string = '';

  constructor(private formBuilder: FormBuilder,
              public item: UserCreationStepService,
              private commonService: CommonService,
              private userService: UserService,
              private storageService: StorageService
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

    this.pictureUrl = `${environment.serverUrl}${GeneralConstants.CONSTANT_COMMON_ROUTE_PATH_STORAGE}?${GeneralConstants.CONSTANT_MODULE_SHARED_MODEL_STORAGE_TYPE_PICTURE}`;

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

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  onChange(event): void {
    console.log(event);
    if (event.type === 'success') {
      console.log(`${environment.serverUrl}pictures/${event.file.response[0].name}?width=300&height=300`);

      //this.storedPicture = `${environment.serverUrl}pictures/${event.file.response[0].name}?width=300&height=300`;
      this.storedPicture = event.file.thumbUrl;
      //console.log(this.storedPicture);

      this.storageService.get(event.file.response[0].name);
    }
  }
}
