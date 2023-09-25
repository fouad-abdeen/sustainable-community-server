import Container, { Service } from "typedi";
import {
  BaseRepository,
  Context,
  MongoConnection,
  MongoConnectionProvider,
  throwError,
} from "../core";
import { SellerItem } from "../models";
import { ISellerItemRepository } from "./interfaces";
import { SellerItemQuery } from "../controllers/request";

@Service()
export class SellerItemRepository
  extends BaseRepository
  implements ISellerItemRepository
{
  private readonly _connection: MongoConnection<SellerItem, typeof SellerItem>;

  constructor(private mongoService: MongoConnectionProvider) {
    if (!mongoService) mongoService = Container.get(MongoConnectionProvider);
    super(__filename, mongoService);
    this._connection = mongoService.getConnection(SellerItem, this._logger);
  }

  async getListOfItems(conditions: SellerItemQuery): Promise<SellerItem[]> {
    this._logger.info(
      `Getting list of items with the properties: ${JSON.stringify(
        conditions,
        null,
        2
      )}`
    );

    const items = await this._connection.query<
      SellerItemQuery,
      unknown,
      SellerItem[]
    >({ conditions });

    if (!items || items.length === 0)
      throwError(
        `No items found with the properties: ` +
          `seller id: ${conditions.sellerId}, category id: ${conditions.categoryId}, is available: ${conditions.isAvailable}`,
        404
      );

    return items;
  }

  async getItem<S>(id: string, projection?: string): Promise<SellerItem | S> {
    this._logger.info(`Getting item with id: ${id}`);

    const item = await this._connection.queryOne<{ _id: string }, S>(
      { _id: id },
      projection
    );

    if (!item) throwError(`Item with id ${id} not found`, 404);

    return item;
  }

  async createItem(item: SellerItem): Promise<SellerItem> {
    this._logger.info(`Creating item with name: ${item.name}`);

    return await this._connection.insertOne({
      ...item,
      createdAt: +new Date(),
      createdBy: Context.getUser()._id,
    });
  }

  async updateItem(item: SellerItem): Promise<SellerItem> {
    this._logger.info(`Updating item with id: ${item._id}`);

    return await this._connection.updateOne(
      { _id: item._id },
      { ...item, updatedAt: +new Date(), updatedBy: Context.getUser()._id }
    );
  }

  async deleteItem(id: string): Promise<void> {
    this._logger.info(`Deleting item with id: ${id}`);

    await this._connection.deleteOne({ _id: id });
  }
}
