import { prop } from "@typegoose/typegoose";
import { MongoDocument } from "./mongo-document.model";
import { CartItem } from "./common";

export class ShoppingCart extends MongoDocument {
  @prop({ required: true, type: String })
  public ownerId!: string;

  @prop({ type: Number, default: 0 })
  public total!: number;

  @prop({ type: Array<CartItem>, default: [] })
  public items!: CartItem[];
}
