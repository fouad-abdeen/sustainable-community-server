import { prop } from "@typegoose/typegoose";
import { MongoDocument } from "./mongo-document.model";

export class SellerItem extends MongoDocument {
  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public description!: string;

  @prop({ required: true, type: Number })
  public price!: number;

  @prop({ required: true, type: String })
  public categoryId!: string;

  @prop({ required: true, type: String })
  public sellerId!: string;

  @prop({ type: Boolean, default: true })
  public isAvailable!: boolean;

  @prop({ type: Number, default: Infinity })
  public quantity!: number;

  @prop({ type: String })
  public imageUrl?: string;
}
