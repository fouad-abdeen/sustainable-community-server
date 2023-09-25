import { prop } from "@typegoose/typegoose";
import { CartItem, CustomerCheckoutInfo, OrderStatus } from ".";
import { MongoDocument } from ".";

export class Order extends MongoDocument {
  @prop({ required: true, type: Number })
  public totalAmount!: number;

  @prop({ required: true, type: Array<CartItem> })
  public items!: CartItem[];

  @prop({ required: true, type: Object })
  public customerCheckoutInfo!: CustomerCheckoutInfo;

  @prop({ required: true, type: String })
  public customerId!: string;

  @prop({ required: true, type: String })
  public sellerId!: string;

  @prop({ type: String, default: OrderStatus.PENDING })
  public status!: OrderStatus;
}
