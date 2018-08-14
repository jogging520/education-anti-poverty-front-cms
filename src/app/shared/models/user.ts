export class User {
  id: string;
  type: string;
  userName: string;
  password: string;
  realName: string;
  avatar?: string;
  appTypes: string[];
  roles: string[];
  permissions?: number[];
  affiliations: {
    type?: string;
    organization?: string;
  }[] = [{}];
  mobiles: string[];
  emails?: string[];
  wechates?: string[];
  status: string;
}
