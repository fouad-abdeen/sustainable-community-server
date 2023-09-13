import Container, { Service } from "typedi";
import {
  BaseRepository,
  IMongoConnection,
  MongoConnectionProvider,
} from "../core";
import { Category, CategoryType } from "../models";
import { ICategoryRepository } from "./interfaces";

@Service()
export class CategoryRepository
  extends BaseRepository
  implements ICategoryRepository
{
  private readonly _connection: IMongoConnection<Category>;

  constructor(private mongoService: MongoConnectionProvider) {
    if (!mongoService) mongoService = Container.get(MongoConnectionProvider);
    super(__filename, mongoService);
    this._connection = mongoService.getConnection(Category, this._logger);
  }

  async getOneCategory(id: string): Promise<Category> {
    this._logger.info(`Getting category with id: ${id}`);
    try {
      const category = await this._connection.queryOne({ _id: id });
      if (!category) throw new Error();
      return category;
    } catch (error) {
      throw new Error(`Category with id ${id} not found`);
    }
  }

  async getListOfCategories(type: CategoryType): Promise<Category[]> {
    this._logger.info(`Getting list of categories with type: ${type}`);

    const categories = await this._connection.query<
      { type: CategoryType },
      unknown,
      Category[]
    >({ conditions: { type } });

    if (!categories || categories.length === 0)
      throw new Error(`No categories found with the properties: ${type}`);

    return categories;
  }
}
