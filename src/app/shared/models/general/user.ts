export class User {
  id: string;
  type: string;
  name: string;
  password?: string;
  salt?: string;
  realName: string;
  avatar?: string;
  appTypes: string[];
  category: string;
  roles: string[];
  permissions?: number[];
  affiliations: {
    common: string[];
    default: string[];
  };
  mobile?: string;
  email?: string;
  weChat?: string;
  createTime: string;
  timestamp: string;
  status: string;
  serialNo: string;
  description?: string;
}
