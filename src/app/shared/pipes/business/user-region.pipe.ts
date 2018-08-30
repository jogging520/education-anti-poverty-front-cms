import {OnInit, Pipe, PipeTransform} from '@angular/core';
import {User} from "@shared/models/general/user";
import {CacheService} from "@delon/cache";
import {Organization} from "@shared/models/general/organization";

@Pipe({
  name: 'userRegion'
})
export class UserRegionPipe implements PipeTransform, OnInit {

  organization: Organization;

  constructor(private cacheService: CacheService) {}

  ngOnInit() {
    this.cacheService
      .get<Organization>('organization')
      .subscribe(organization => {
        this.organization = organization;
      });
  }

  /**
   * 方法：根据组织机构的归属地进行过滤。
   * @param {User[]} users 用户列表
   * @param {string} region 地域
   * @return {any} 在该地域内的用户列表
   */
  transform(users: User[], region: string): any {

    let filteredUsers: User[] = [];

    users.forEach((user) => {

      user.affiliations.common.forEach((org) => {
        if (org.indexOf(region) != -1) {
          filteredUsers.push(user);
        }
      });

    });

    return filteredUsers;
  }

  private getRegion(organization: Organization, code: string): string {
    if (!organization || !code)
      return null;

    if (organization.code === code)
      return organization.region;


    if (organization.children) {
      for (let child of organization.children) {
         return this.getRegion(child, code);
      }
    }

    return null;
  }
}
