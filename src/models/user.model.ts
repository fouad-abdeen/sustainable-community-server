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
  public verified?: boolean;

  @prop({ type: Object, default: {} })
  public profile?: CustomerProfile | VendorProfile;

  @prop({ type: Array<object>, default: [] })
  public tokensBlocklist?: {
    token: string;
    expiresIn: number;
  }[];
}

export class CustomerProfile {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  // Items ids
  wishlist: string[];
}
// The customer profile API response should include an array of items instead of ids only

export class VendorProfile {
  name: string;
  description: string;
  phone: string;
  address: string;
  businessEmail: string;
  // Category id
  category: string;
  logoUrl?: string;
  websiteUrl?: string;
}
// The vendor profile API response should include an array of items and the category object instead of id only
