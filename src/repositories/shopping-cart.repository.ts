import Container, { Service } from "typedi";
import { BaseRepository, MongoConnectionProvider, throwError } from "../core";
import { IShoppingCartRepository } from "./interfaces/shopping-cart.interface";
import { MongoConnection } from "../core/providers/database/mongo/mongo.connection";
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

    const cart = await this._connection.queryOne<unknown, ShoppingCart>({
      ownerId,
    });

    if (!cart) return await this.createCart(ownerId);

    return cart;
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

    const cart = await this.getCart(ownerId);

    const itemIndex = cart.items.findIndex((item) => item.id === item.id);

    if (itemIndex === -1) cart.items.push(item);
    else {
      const quantity = cart.items[itemIndex].quantity + item.quantity;

      if (quantity > item.availability)
        throwError(
          `Not enough in-stock items available, only ${item.availability} left`,
          400
        );

      cart.items[itemIndex] = {
        ...item,
        quantity,
      };
    }

    cart.total += item.price * item.quantity;
    cart.updatedAt = +new Date();

    await this._connection.updateOne({ ownerId }, cart);
  }

  async removeItem(ownerId: string, itemId: string): Promise<void> {
    this._logger.info(
      `Removing item with id: ${itemId} from shopping cart for customer with id: ${ownerId}`
    );

    const cart = await this.getCart(ownerId);

    const itemIndex = cart.items.findIndex((item) => item.id === itemId);

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

    const cart = await this.getCart(ownerId);

    const itemIndex = cart.items.findIndex((item) => item.id === item.id);

    if (itemIndex === -1) return;

    cart.items[itemIndex] = item;
    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    cart.updatedAt = +new Date();

    await this._connection.updateOne({ ownerId }, cart);
  }

  private async createCart(ownerId: string): Promise<ShoppingCart> {
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
}
