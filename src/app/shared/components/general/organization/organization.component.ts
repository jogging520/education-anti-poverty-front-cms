import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Organization} from "@shared/models/general/organization";
import {Option} from "@shared/models/general/option";
import {CacheService} from "@delon/cache";

@Component({
  selector: 'app-nb-organization',
  templateUrl: './organization.component.html',
  styles: []
})
export class OrganizationComponent implements OnInit {

  @Input() code: string;
  @Output() organization: EventEmitter<number> = new EventEmitter();

  organizationOptions:any  = [] ;
  selectedOrganization: any[];

  constructor(
    private cacheService: CacheService
  ) { }

  ngOnInit() {
    this.cacheService
      .get<Organization>('organization')
      .subscribe(organization => {
        this.organizationOptions.push(this.transform(this.locate(organization, this.code)));
      });

  }

  onChanges(event: any): void {
    this.organization.emit(this.selectedOrganization[this.selectedOrganization.length-1]);
  }

  /**
   * 方法：根据编号递归查找具体的组织机构位置
   * @param {Organization} organization 组织机构
   * @param {string} code 编码
   * @return {Organization} 定位到的组织机构
   */
  private locate(organization: Organization, code: string): Organization {
    if(organization.code === code || code === '0')
      return organization;

    let org: Organization;

    if (organization.children) {
      for (let child of organization.children) {
        org = this.locate(child, code);

        if (org)
          return org;
      }
    }

    return null;
  }

  /**
   * 方法：将organization转换成option（级联选择器）
   * @param {Organization|Region} organization 组织机构
   * @return {Option} 级联选择器的选项
   */
  private transform(organization: Organization): Option {

    if(!organization)
      return null;

    let option: any = new Option();

    option.value = organization.code;
    option.label = organization.name;

    if (!organization.children) {
      option.isLeaf = true;

      return option;
    }

    if (organization.children) {
      for (let child of organization.children) {
        option.children.push(this.transform(child));
      }
    }

    return option;
  }
}
