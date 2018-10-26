export class Operation {
  id: string;
  type: string;
  appType: string;
  category: string;
  user: string;
  session: string;
  businessType: string;
  createTime: Date;
  timestamp: Date;
  status: string;
  description?: string;
  children?: Operation[];
}
