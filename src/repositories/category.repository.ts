import Container, { Service } from "typedi";
import {
  BaseRepository,
  Context,
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
    const category = await this._connection.queryOne({ _id: id });
    if (!category) throw new Error(`Item with id ${id} not found`);
    return category;
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

  async createCategory(category: Category): Promise<Category> {
    this._logger.info(
      `Creating category of type ${category.type} with name: ${category.name}`
    );
    return await this._connection.insertOne({
      ...category,
      createdAt: +new Date(),
      createdBy: Context.getUser()._id,
    });
  }

  async updateCategory(category: Category): Promise<Category> {
    this._logger.info(`Updating category with id: ${category._id}`);
    return await this._connection.updateOne(
      { _id: category._id },
      { ...category, updatedAt: +new Date(), updatedBy: Context.getUser()._id }
    );
  }

  async deleteCategory(id: string): Promise<void> {
    this._logger.info(`Deleting category with id: ${id}`);
    await this._connection.deleteOne({ _id: id });
  }
}
