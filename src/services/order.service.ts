import { Service } from "typedi";
import {
  OrderRepository,
  SellerItemRepository,
  ShoppingCartRepository,
  UserRepository,
} from "../repositories";
import { BaseService, Context, throwError } from "../core";
import {
  CustomerProfile,
  Order,
  OrderStatus,
  SellerItem,
  ShippingRate,
  User,
  UserRole,
} from "../models";
import { ShoppingCartService } from ".";

@Service()
export class OrderService extends BaseService {
  constructor(
    private _orderRepository: OrderRepository,
    private _userRepository: UserRepository,
    private _sellerItemRepository: SellerItemRepository,
    private _shoppingCartRepository: ShoppingCartRepository,
    private _shoppingCartService: ShoppingCartService
  ) {
    super(__filename);
  }

  async placeOrder(customerId: string): Promise<Order> {
    this._logger.info(
      `Attempting to place a new order for the customer with id: ${customerId}`
    );

    // Update the shopping cart and validate the included items
    const cart = await this._shoppingCartService.updateCart(
      await this._shoppingCartRepository.getCart(customerId),
      true
    );

    // Check if the cart has items from multiple sellers
    const sellerIds = [...new Set(cart.items.map((item) => item.sellerId))];

    if (sellerIds.length > 1)
      throwError("Cannot place an order with items from multiple sellers", 400);

    if (cart.items.length < 1)
      throwError("Cannot place an order with an empty cart", 400);

    const totalAmount = cart.total + ShippingRate.TRIPOLI;

    const customer = await this._userRepository.getUserById<User>(
      customerId,
      "email profile"
    );
    const { firstName, lastName, phoneNumber, address } =
      customer.profile as CustomerProfile;

    if (!firstName || !lastName)
      throwError("Cannot place an order without first and last name", 400);

    if (!phoneNumber)
      throwError("Cannot place an order without phone number", 400);

    if (!address) throwError("Cannot place an order without address", 400);

    const placedOrder = await this._orderRepository.placeOrder({
      totalAmount,
      items: cart.items,
      customerCheckoutInfo: {
        email: customer.email,
        firstName,
        lastName,
        phoneNumber,
        address,
      },
      customerId: customerId,
      sellerId: cart.items[0].sellerId,
      status: OrderStatus.PENDING,
    });

    // Update the quantity of the items in the seller's inventory
    await Promise.all(
      cart.items.map(async (item) => {
        const { quantity } = await this._sellerItemRepository.getItem<{
          quantity: number;
        }>(item.id, "quantity");

        const updatedQuantity = quantity - item.quantity;

        return await this._sellerItemRepository.updateItem({
          _id: item.id,
          quantity: updatedQuantity,
        } as SellerItem);
      })
    );

    // Clear the shopping cart
    await this._shoppingCartRepository.clearCart(customerId);

    // TODO: Send an email to the customer

    return placedOrder;
  }

  async cancelOrder(id: string): Promise<Order> {
    this._logger.info(`Attempting to cancel the order with id: ${id}`);

    const user = Context.getUser();
    const owner =
      user.role === UserRole.CUSTOMER
        ? { customerId: user._id }
        : { sellerId: user._id };

    const order = await this._orderRepository.getOrderById(id, owner);

    if (owner.customerId) {
      if (user._id !== order.customerId)
        throwError("Cannot cancel an order that is not yours", 403);

      if (order.status !== OrderStatus.PENDING)
        throwError(`Cannot cancel an order that is ${order.status}`, 400);
    } else {
      if (user._id !== order.sellerId)
        throwError(
          "Cannot cancel an order that you are not responsible for",
          403
        );

      if (
        order.status !== OrderStatus.PENDING &&
        order.status !== OrderStatus.PROCESSING
      )
        throwError(`Cannot cancel an order that is ${order.status}`, 400);
    }

    const cancelledOrder = await this._orderRepository.updateOrder({
      _id: id,
      status: OrderStatus.CANCELLED,
    } as Order);

    // Update the quantity of the items in the seller's inventory
    await Promise.all(
      order.items.map(async (item) => {
        const { quantity } = await this._sellerItemRepository.getItem<{
          quantity: number;
        }>(item.id, "quantity");

        const updatedQuantity = quantity + item.quantity;

        await this._sellerItemRepository.updateItem({
          _id: item.id,
          quantity: updatedQuantity,
        } as SellerItem);
      })
    );

    // TODO: Send an email to the customer

    return cancelledOrder;
  }

  async updateOrder(id: string, status: OrderStatus): Promise<Order> {
    this._logger.info(`Attempting to update the order with id: ${id}`);

    const user = Context.getUser();
    const owner =
      user.role === UserRole.CUSTOMER
        ? { customerId: user._id }
        : { sellerId: user._id };

    const order = await this._orderRepository.getOrderById(id, owner);

    if (user._id !== order.sellerId)
      throwError(
        "Cannot update an order that you are not responsible for",
        403
      );

    if (order.status === status) return order;

    if (order.status === OrderStatus.CANCELLED)
      throwError("cannot update a cancelled order", 400);

    if (order.status === OrderStatus.COMPLETED)
      throwError("cannot update a completed order", 400);

    if (status === OrderStatus.CANCELLED) {
      return await this.cancelOrder(id);
    }

    const updatedOrder = await this._orderRepository.updateOrder({
      _id: id,
      status,
    } as Order);

    // TODO: Send an email to the customer

    return updatedOrder;
  }
}
