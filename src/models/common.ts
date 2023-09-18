import { CustomerProfile, SellerProfile } from "./user.model";

export class UserInfo {
  id: string;
  email: string;
  role: UserRole;
  profile: CustomerProfile | SellerProfile;
}

export enum UserRole {
  CUSTOMER = "Customer",
  SELLER = "Seller",
  ADMIN = "Admin",
}
