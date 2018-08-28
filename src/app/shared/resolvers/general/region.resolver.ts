import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {CommonService} from "@shared/services/general/common.service";
import {OrganizationService} from "@shared/services/general/organization.service";
import {Observable} from "rxjs/index";
import {catchError, filter} from "rxjs/operators";
import {Region} from "@shared/models/general/region";

@Injectable({
  providedIn: 'root'
})
export class RegionResolver implements Resolve<any> {

  constructor(
    private commonService: CommonService,
    private organizationService: OrganizationService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.organizationService
      .queryRegions()
      .pipe(
        filter((region: Region) => region.status === 'ACTIVE'),
        catchError(error => this.commonService.handleError(error))
      );
  }
}
