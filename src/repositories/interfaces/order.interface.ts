import { OrderQuery } from "../../controllers/request/order.request";
import { Order } from "../../models";

export interface IOrderRepository {
  /**
   * Gets all orders for a seller or customer
   * @param conditions conditions to filter the orders
   */
  getOrders(conditions: OrderQuery): Promise<Order[]>;

  /**
   * Gets an order by id
   * @param id id of the order
   * @param ownerId id of the owner of the order (either customer or seller)
   */
  getOrderById(
    id: string,
    ownerId: { customerId?: string; sellerId?: string }
  ): Promise<Order>;

  /**
   * Submits an order request to the seller
   * @param order order to submit
   */
  placeOrder(order: Order): Promise<Order>;

  /**
   * Cancels an order
   * @param id id of the order to cancel
   */
  cancelOrder(id: string): Promise<Order>;

  /**
   * Updates an order
   * @param order order to update
   */
  updateOrder(order: Order): Promise<Order>;
}
