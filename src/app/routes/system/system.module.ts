import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SystemRoutingModule } from './system-routing.module';
import { SystemOperationComponent } from './operation/operation.component';
import { SystemOperationViewComponent } from './operation/view/view.component';
import { SystemUserComponent } from './user/user.component';
import { SystemPrivilegeComponent } from './privilege/privilege.component';
import { SystemUserCreationComponent } from './user/creation/creation.component';
import { SystemUserDetailComponent } from './user/detail/detail.component';
import { UserCreationBasicStepComponent } from './user/creation/user-creation-basic-step/user-creation-basic-step.component';
import { UserCreationPasswordStepComponent } from './user/creation/user-creation-password-step/user-creation-password-step.component';
import { UserCreationPrivilegeStepComponent } from './user/creation/user-creation-privilege-step/user-creation-privilege-step.component';
import { UserCreationOtherStepComponent } from './user/creation/user-creation-other-step/user-creation-other-step.component';

const COMPONENTS = [
  SystemOperationComponent,
  SystemUserComponent,
  SystemPrivilegeComponent,
  SystemUserCreationComponent,
  SystemUserDetailComponent,
  SystemOperationViewComponent];
const COMPONENTS_NOROUNT = [
  ];

@NgModule({
  imports: [
    SharedModule,
    SystemRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    UserCreationBasicStepComponent,
    UserCreationPasswordStepComponent,
    UserCreationPrivilegeStepComponent,
    UserCreationOtherStepComponent
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SystemModule { }
