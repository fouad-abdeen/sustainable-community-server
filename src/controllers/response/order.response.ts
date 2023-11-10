import {
  CartItem,
  CustomerCheckoutInfo,
  Order,
  OrderStatus,
} from "../../models";

export class OrderResponse {
  id: string;
  totalAmount: number;
  items: CartItem[];
  customerCheckoutInfo: CustomerCheckoutInfo;
  customerId: string;
  sellerId: string;
  status: OrderStatus;
  createdAt?: number;
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
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  public static getListOfOrdersResponse(orders: Order[]): OrderResponse[] {
    return orders.map((order) => this.getOrderResponse(order));
  }
}
