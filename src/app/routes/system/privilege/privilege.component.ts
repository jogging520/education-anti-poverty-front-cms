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

  regionOptions:any  = [] ;
  selectedRegion: any[];
  center:any = [103.719156, 36.115523];

  constructor(private http: _HttpClient,
              private modal: ModalHelper,
              private activatedRoute: ActivatedRoute,
              private commonService: CommonService,
              private organizationService: OrganizationService) {
    this.activatedRoute
      .data
      .pipe(map(data => data))
      .subscribe((data) => {

        let region: Region = data.regionParams;

        this.regionOptions.push(this.commonService.transformToOption(this.commonService.locate(region, '9')));
      });
  }

  ngOnInit() { }

  onChanges(event: any): void {
    console.log(this.regionOptions);
    console.log(this.selectedRegion);
    console.log(event);

    console.log(this.selectedRegion[this.selectedRegion.length-1]);

    this.queryRegionLongitudeAndLatitude(this.selectedRegion[this.selectedRegion.length-1]);

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
}
