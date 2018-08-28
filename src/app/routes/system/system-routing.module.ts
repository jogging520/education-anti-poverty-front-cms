import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemOperationComponent } from './operation/operation.component';
import { SystemUserComponent } from './user/user.component';
import {OperationResolver} from "@shared/resolvers/system/operation.resolver";
import {UserResolver} from "@shared/resolvers/system/user.resolver";
import {OrganizationResolver} from "@shared/resolvers/system/organization.resolver";
import {RegionResolver} from "@shared/resolvers/system/region.resolver";

const routes: Routes = [
  { path: 'operation',
    component: SystemOperationComponent,
    resolve: {operationParams: OperationResolver}
  },
  { path: 'user',
    component: SystemUserComponent,
    resolve: {userParams: UserResolver, organizationParams: OrganizationResolver, regionParams: RegionResolver}
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
