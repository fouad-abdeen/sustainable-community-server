export class UserInfo {
  id: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  CUSTOMER = "customer",
  VENDOR = "vendor",
  ADMIN = "admin",
}
