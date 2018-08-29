import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import {ActivatedRoute} from "@angular/router";
import {tap, map} from "rxjs/operators";
import {Region} from "@shared/models/general/region";
import {CommonService} from "@shared/services/general/common.service";
import {OrganizationService} from "@shared/services/general/organization.service";

@Component({
  selector: 'app-system-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.less'],
})
export class SystemPrivilegeComponent implements OnInit {

  center:any = [103.719156, 36.115523];

  constructor(private http: _HttpClient,
              private modal: ModalHelper,
              private commonService: CommonService,
              private organizationService: OrganizationService) { }

  ngOnInit() { }

  onChanges(event: any): void {
    console.log(event);

    //console.log(this.selectedRegion[this.selectedRegion.length-1]);

    //this.queryRegionLongitudeAndLatitude(this.selectedRegion[this.selectedRegion.length-1]);

    console.log(this.center);
  }

  private queryRegionLongitudeAndLatitude(code: string): void {
    this.organizationService
      .queryRegions()
      .subscribe((region: Region) => {
        let locatedRegion: Region = this.locate(region, code);
        this.center = [];
        this.center.push(locatedRegion.longitude, locatedRegion.latitude);
      })
  }


  private locate(region: Region, code: string): Region {
    if(region.code === code) {
      return region;
    }

    let reg: Region;

    if (region.children) {
      for (var child of region.children) {
        reg = this.locate(child, code);

        if (reg)
          return reg;
      }
    }

    return null;
  }

  private onRegion(event: any): void {
    console.log(event);
  }

  private onCenter(event: any): void {
    console.log(event);
    this.center = event;
  }

  private onOrganization(event: any): void {
    console.log(event);
  }
}
