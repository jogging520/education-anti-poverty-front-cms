import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemOperationComponent } from './operation/operation.component';
import { SystemUserComponent } from './user/user.component';
import {OperationResolver} from "@shared/resolvers/system/operation.resolver";
import {UserResolver} from "@shared/resolvers/general/user.resolver";
import {OrganizationResolver} from "@shared/resolvers/general/organization.resolver";
import {RegionResolver} from "@shared/resolvers/general/region.resolver";
import { SystemPrivilegeComponent } from './privilege/privilege.component';
import { SystemUserCreationComponent } from './user/creation/creation.component';
import { SystemUserDetailComponent } from './user/detail/detail.component';

const routes: Routes = [
  { path: 'operation',
    component: SystemOperationComponent,
    resolve: {operationParams: OperationResolver}
  },
  { path: 'user',
    component: SystemUserComponent,
    resolve: {userParams: UserResolver, organizationParams: OrganizationResolver, regionParams: RegionResolver}
  }
  ,
  { path: 'privilege',
    component: SystemPrivilegeComponent,
    resolve: {regionParams: RegionResolver}
  },
  { path: 'user-creation', component: SystemUserCreationComponent, data: { title: '新建用户' } },
  { path: 'userDetail', component: SystemUserDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
