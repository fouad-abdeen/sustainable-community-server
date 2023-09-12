import Container, { Service } from "typedi";
import { BaseRepository, MongoConnectionProvider } from "../core";
import { SellerItem } from "../models";
import { ISellerItemRepository } from "./interfaces";
import { MongoConnection } from "../core/providers/database/mongo/mongo.connection";
import { SellerItemRequest } from "../controllers/request/seller-item.request";

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

  async getOneItem(id: string): Promise<SellerItem> {
    this._logger.info(`Getting item with id: ${id}`);
    try {
      return await this._connection.queryOne({ _id: id });
    } catch (error) {
      throw new Error(`Item with id ${id} not found`);
    }
  }

  async getListOfItems(conditions: SellerItemRequest): Promise<SellerItem[]> {
    this._logger.info(
      `Getting list of items with the properties: ${JSON.stringify(
        conditions,
        null,
        2
      )}`
    );

    const items = await this._connection.query<
      SellerItemRequest,
      unknown,
      SellerItem[]
    >({ conditions: conditions });

    if (!items || items.length === 0)
      throw new Error(
        `No items found with the properties: ` +
          `seller id: ${conditions.sellerId}, category id: ${conditions.categoryId}, is available: ${conditions.isAvailable}`
      );

    return items;
  }
}
