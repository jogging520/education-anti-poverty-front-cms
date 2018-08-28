import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SystemRoutingModule } from './system-routing.module';
import { SystemOperationComponent } from './operation/operation.component';
import { SystemOperationViewComponent } from './operation/view/view.component';
import { SystemUserComponent } from './user/user.component';
import { SystemPrivilegeComponent } from './privilege/privilege.component';
import { NgxAmapModule } from 'ngx-amap';

const COMPONENTS = [
  SystemOperationComponent,
  SystemUserComponent,
  SystemPrivilegeComponent];
const COMPONENTS_NOROUNT = [
  SystemOperationViewComponent];

@NgModule({
  imports: [
    SharedModule,
    SystemRoutingModule,
    NgxAmapModule.forRoot({
      apiKey: '1d54cf0e4dac3ed6da30cbad7627dcdd'
    })
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SystemModule { }
