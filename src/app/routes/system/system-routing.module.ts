import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemOperationComponent } from './operation/operation.component';
import { SystemUserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'operation', component: SystemOperationComponent },
  { path: 'user', component: SystemUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
