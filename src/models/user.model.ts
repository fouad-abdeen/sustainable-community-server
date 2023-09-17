import { prop } from "@typegoose/typegoose";
import { MongoDocument, UserRole } from ".";

export class User extends MongoDocument {
  @prop({ required: true, type: String })
  public email!: string;

  @prop({ required: true, type: String })
  public password!: string;

  @prop({ required: true, type: String })
  public role!: UserRole;

  @prop({ type: Boolean, default: false })
  public verified!: boolean;

  @prop({ type: Object, default: {} })
  public profile!: CustomerProfile | SellerProfile;

  @prop({ type: Array<object>, default: [] })
  public tokensBlocklist!: TokenObject[];

  @prop({ type: Number, default: +new Date() })
  public passwordUpdatedAt!: number;
}

export class CustomerProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  whishlist: string[];
}

export class SellerProfile {
  name: string;
  description: string;
  phoneNumber: string;
  address: string;
  businessEmail: string;
  categoryId: string;
  itemCategories?: string[];
  logoUrl?: string;
  websiteUrl?: string;
}

export interface TokenObject {
  token: string;
  expiresIn: number;
}
