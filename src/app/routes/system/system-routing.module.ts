import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemOperationComponent } from './operation/operation.component';
import { SystemUserComponent } from './user/user.component';
import {UserResolver} from "@shared/resolvers/general/user.resolver";
import { SystemPrivilegeComponent } from './privilege/privilege.component';
import { SystemUserCreationComponent } from './user/creation/creation.component';
import { SystemUserDetailComponent } from './user/detail/detail.component';
import {OperationResolver} from "@shared/resolvers/business/operation.resolver";

const routes: Routes = [
  { path: 'operation',
    component: SystemOperationComponent,
    resolve: {operationParams: OperationResolver},
    data: { title: '查看操作记录' }
  },
  { path: 'user',
    component: SystemUserComponent,
    resolve: {userParams: UserResolver},
    data: { title: '用户管理' }
  }
  ,
  { path: 'privilege',
    component: SystemPrivilegeComponent
  },
  { path: 'user-creation', component: SystemUserCreationComponent, data: { title: '新建用户' } },
  { path: 'userDetail', component: SystemUserDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
