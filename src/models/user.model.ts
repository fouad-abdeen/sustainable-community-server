import { prop } from "@typegoose/typegoose";
import {
  CustomerProfile,
  MongoDocument,
  SellerProfile,
  TokenObject,
  UserRole,
} from ".";

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
