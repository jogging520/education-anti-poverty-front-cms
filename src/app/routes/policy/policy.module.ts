import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyListComponent } from './list/list.component';

const COMPONENTS = [
  PolicyListComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PolicyRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class PolicyModule { }
