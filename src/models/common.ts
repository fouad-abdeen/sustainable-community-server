export class UserInfo {
  id: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  CUSTOMER = "Customer",
  SELLER = "Seller",
  ADMIN = "Admin",
}
