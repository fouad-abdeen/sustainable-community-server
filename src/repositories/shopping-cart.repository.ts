import Container, { Service } from "typedi";
import {
  BaseRepository,
  MongoConnection,
  MongoConnectionProvider,
  throwError,
} from "../core";
import { IShoppingCartRepository } from "./interfaces";
import { CartItem, ShoppingCart } from "../models";

@Service()
export class ShoppingCartRepository
  extends BaseRepository
  implements IShoppingCartRepository
{
  private readonly _connection: MongoConnection<
    ShoppingCart,
    typeof ShoppingCart
  >;

  constructor(private mongoService: MongoConnectionProvider) {
    if (!mongoService) mongoService = Container.get(MongoConnectionProvider);
    super(__filename, mongoService);
    this._connection = mongoService.getConnection(ShoppingCart, this._logger);
  }

  async getCart(ownerId: string): Promise<ShoppingCart> {
    this._logger.info(`Getting shopping cart for customer with id: ${ownerId}`);

    return await this._connection.queryOne<unknown, ShoppingCart>({
      ownerId,
    });
  }

  async createCart(ownerId: string): Promise<ShoppingCart> {
    this._logger.info(
      `Creating a shopping cart for customer with id: ${ownerId}`
    );

    return await this._connection.insertOne({
      ownerId,
      total: 0,
      items: [],
      updatedAt: +new Date(),
    });
  }

  async updateCart(cart: ShoppingCart): Promise<ShoppingCart> {
    this._logger.info(
      `Updating shopping cart for customer with id: ${cart.ownerId}`
    );

    return await this._connection.updateOne({ ownerId: cart.ownerId }, cart);
  }

  async clearCart(ownerId: string): Promise<void> {
    this._logger.info(
      `Clearing shopping cart for customer with id: ${ownerId}`
    );

    await this._connection.updateOne(
      { ownerId },
      {
        total: 0,
        items: [],
        updatedAt: +new Date(),
      }
    );
  }

  async addItem(ownerId: string, item: CartItem): Promise<void> {
    this._logger.info(
      `Adding item with id: ${item.id} to shopping cart for customer with id: ${ownerId}`
    );

    const cart =
      (await this.getCart(ownerId)) ?? (await this.createCart(ownerId));

    if (cart.items.length >= 1)
      if (cart.items[0].sellerId !== item.sellerId)
        throwError(
          `Cannot add items from different sellers to the same cart`,
          400
        );

    cart.items.push(item);
    cart.total += item.price * item.quantity;
    cart.updatedAt = +new Date();

    await this._connection.updateOne({ ownerId }, cart);
  }

  async removeItem(ownerId: string, itemId: string): Promise<void> {
    this._logger.info(
      `Removing item with id: ${itemId} from shopping cart for customer with id: ${ownerId}`
    );

    const cart =
      (await this.getCart(ownerId)) ?? (await this.createCart(ownerId));

    const itemIndex = cart.items.findIndex(
      (cartItem) => cartItem.id === itemId
    );

    if (itemIndex === -1) return;

    cart.items.splice(itemIndex, 1);
    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    cart.updatedAt = +new Date();

    await this._connection.updateOne({ ownerId }, cart);
  }

  async updateItem(ownerId: string, item: CartItem): Promise<void> {
    this._logger.info(
      `Updating item with id: ${item.id} from shopping cart for customer with id: ${ownerId}`
    );

    const cart =
      (await this.getCart(ownerId)) ?? (await this.createCart(ownerId));

    const itemIndex = cart.items.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (itemIndex === -1) return;

    cart.items[itemIndex] = item;
    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    cart.updatedAt = +new Date();

    await this._connection.updateOne({ ownerId }, cart);
  }
}
