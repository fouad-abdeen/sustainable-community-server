import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
} from "class-validator";
import { SellerItem } from "./seller-item.model";

// #region Enums
export enum UserRole {
  CUSTOMER = "Customer",
  SELLER = "Seller",
  ADMIN = "Admin",
}

export enum CategoryType {
  ITEM = "Item",
  PRODUCT = "Product",
  SERVICE = "Service",
}
// #endregion

// #region Classes
export class CustomerProfile {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;

  @IsString({ each: true })
  wishlist: string[];
}

export class SellerProfile {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;

  @IsString()
  businessEmail: string;

  @IsString()
  categoryId: string;

  @IsString({ each: true })
  itemCategories?: string[];

  @IsString()
  logoUrl?: string;

  @IsString()
  websiteUrl?: string;
}

export class UserBriefInfo {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  verified: boolean;
}

export class UserInfo {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsObject()
  profile: CustomerProfile | SellerProfile;
}

export class Tokens {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}

export class WishlistItem {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  imageUrl?: string;
}

export class ItemSeller {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class CategoryInfo {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class SellerInfo {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  logoUrl?: string;
}

export class CartItem {
  @IsString()
  id: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  availability: number;

  @IsBoolean()
  isAvailable: boolean;

  @IsString()
  name: string;

  @IsString()
  imageUrl?: string;
}
// #endregion

// #region Interfaces
export interface TokenObject {
  token: string;
  expiresIn: number;
}

export interface AuthPayload {
  requestId: string;
  identityId: string;
  email: string;
  signedAt?: number;
}

export interface RolesAndPermission {
  roles: UserRole[];
  permission?: string;
  disclaimer?: string;
}
// #endregion

// #region Types
export type ExtendedSellerItemData = SellerItem & {
  category: CategoryInfo;
  seller: ItemSeller;
};
// #endregion
