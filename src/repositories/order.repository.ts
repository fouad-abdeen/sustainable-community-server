import Container, { Service } from "typedi";
import {
  BaseRepository,
  MongoConnection,
  MongoConnectionProvider,
  throwError,
} from "../core";
import { IOrderRepository } from "./interfaces";
import { Order, OrderStatus } from "../models";
import { OrderQuery } from "../controllers/request";

@Service()
export class OrderRepository
  extends BaseRepository
  implements IOrderRepository
{
  private readonly _connection: MongoConnection<Order, typeof Order>;

  constructor(private mongoService: MongoConnectionProvider) {
    if (!mongoService) mongoService = Container.get(MongoConnectionProvider);
    super(__filename, mongoService);
    this._connection = mongoService.getConnection(Order, this._logger);
  }

  async getOrders(
    conditions: OrderQuery,
    forCustomer?: boolean
  ): Promise<Order[]> {
    this._logger.info(
      `Getting order(s) for the ${
        forCustomer ? "customer" : "seller"
      } with id: ${forCustomer ? conditions.customerId : conditions.sellerId}`
    );

    const orders = await this._connection.query<OrderQuery, unknown, Order[]>({
      conditions,
    });

    if (!orders || orders.length === 0)
      throwError(
        `No ${conditions.status ?? "existing"} orders found for the ${
          forCustomer ? "customer" : "seller"
        } with id: ${
          forCustomer ? conditions.customerId : conditions.sellerId
        }`,
        404
      );

    return orders;
  }

  async getOrderById(
    id: string,
    ownerId: { customerId?: string; sellerId?: string }
  ): Promise<Order> {
    const { customerId, sellerId } = ownerId;

    if ((!customerId && !sellerId) || (customerId && sellerId))
      throwError("Either customer's id or seller's id must be provided", 400);

    this._logger.info(
      `Getting the order with id: ${id} for the ${
        customerId ? "customer" : "seller"
      } with id: ${customerId || sellerId}}`
    );

    if (customerId) delete ownerId.sellerId;
    else delete ownerId.customerId;

    const order = await this._connection.queryOne<
      { _id: string; customerId?: string; sellerId?: string },
      Order
    >({
      _id: id,
      ...ownerId,
    });

    if (!order) throwError(`Order with id ${id} not found`, 404);

    return order;
  }

  async placeOrder(order: Order): Promise<Order> {
    this._logger.info(
      `Submitting a new order request to the seller with id: ${order.sellerId}`
    );

    return await this._connection.insertOne({
      ...order,
      createdAt: +new Date(),
    });
  }

  async cancelOrder(id: string): Promise<Order> {
    this._logger.info(`Cancelling order with id: ${id}`);

    return await this._connection.updateOne<{ _id: string }, Order>(
      { conditions: { _id: id } },
      { status: OrderStatus.CANCELLED, updatedAt: +new Date() }
    );
  }

  async updateOrder(order: Order): Promise<Order> {
    this._logger.info(`Updating order with id: ${order._id}`);

    return await this._connection.updateOne(
      { _id: order._id },
      {
        status: order.status,
        updatedAt: +new Date(),
      }
    );
  }
}
