import { IsEnum, IsInstance, IsNumber, IsString } from "class-validator";
import {
  CartItem,
  CustomerCheckoutInfo,
  Order,
  OrderStatus,
} from "../../models";

export class OrderResponse {
  @IsString()
  id: string;

  @IsNumber()
  totalAmount: number;

  @IsInstance(CartItem, { each: true })
  items: CartItem[];

  @IsInstance(CustomerCheckoutInfo)
  customerCheckoutInfo: CustomerCheckoutInfo;

  @IsString()
  customerId: string;

  @IsString()
  sellerId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNumber()
  updatedAt?: number;

  public static getOrderResponse(order: Order): OrderResponse {
    return {
      id: (order._id as string).toString(),
      totalAmount: order.totalAmount,
      items: order.items,
      customerCheckoutInfo: order.customerCheckoutInfo,
      customerId: order.customerId,
      sellerId: order.sellerId,
      status: order.status,
      updatedAt: order.updatedAt,
    };
  }

  public static getListOfOrdersResponse(orders: Order[]): OrderResponse[] {
    return orders.map((order) => this.getOrderResponse(order));
  }
}
