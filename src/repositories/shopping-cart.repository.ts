import Container, { Service } from "typedi";
import { BaseRepository, MongoConnectionProvider, throwError } from "../core";
import { ShoppingCart } from "../models/shopping-cart.model";
import { IShoppingCartRepository } from "./interfaces/shopping-cart.interface";
import { MongoConnection } from "../core/providers/database/mongo/mongo.connection";
import { CartItem } from "../models";

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

  async addItem(ownerId: string, item: CartItem, stock: number): Promise<void> {
    this._logger.info(
      `Adding item with id: ${item.id} to shopping cart for customer with id: ${ownerId}`
    );

    const cart = await this.getCart(ownerId);

    const itemIndex = cart.items.findIndex((item) => item.id === item.id);

    if (itemIndex === -1) cart.items.push(item);
    else cart.items[itemIndex].quantity += item.quantity;

    if (cart.items[itemIndex].quantity > stock)
      throwError(`Only ${stock} items are available`, 400);

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

    const item = cart.items[itemIndex];
    cart.total -= item.price * item.quantity;
    cart.items.splice(itemIndex, 1);
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

    const oldItem = cart.items[itemIndex];
    cart.total -= oldItem.price * oldItem.quantity;
    cart.total += item.price * item.quantity;
    cart.items[itemIndex] = item;
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
