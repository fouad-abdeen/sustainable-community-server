import Container, { Service } from "typedi";
import {
  BaseRepository,
  Context,
  MongoConnection,
  MongoConnectionProvider,
  throwError,
} from "../core";
import { Category, CategoryType } from "../models";
import { ICategoryRepository } from "./interfaces";

@Service()
export class CategoryRepository
  extends BaseRepository
  implements ICategoryRepository
{
  private readonly _connection: MongoConnection<Category, typeof Category>;

  constructor(private mongoService: MongoConnectionProvider) {
    if (!mongoService) mongoService = Container.get(MongoConnectionProvider);
    super(__filename, mongoService);
    this._connection = mongoService.getConnection(Category, this._logger);
  }

  async getOneCategory<C>(
    id: string,
    projection?: string
  ): Promise<Category | C> {
    this._logger.info(`Getting category with id: ${id}`);

    const category = await this._connection.queryOne<{ _id: string }, C>(
      { _id: id },
      projection
    );

    if (!category) throwError(`Category with id ${id} not found`, 404);

    return category;
  }

  async getDefaultItemCategory(): Promise<Category> {
    this._logger.info(`Getting default item category`);

    const category = await this._connection.queryOne<
      { type: CategoryType; name: string },
      Category
    >({ type: CategoryType.ITEM, name: "All" });

    if (!category)
      return await this._connection.insertOne({
        name: "All",
        description: "Default Item Category",
        type: CategoryType.ITEM,
        createdAt: +new Date(),
      });

    return category;
  }

  async getListOfCategories(type?: CategoryType): Promise<Category[]> {
    this._logger.info(`Getting list of categories with type: ${type}`);

    const conditions = type ? { type } : {};

    const categories = await this._connection.query<
      { type: CategoryType },
      unknown,
      Category[]
    >({ conditions, sort: { updatedAt: -1 } });

    if (!categories || categories.length === 0)
      throwError(`No categories found with the properties: ${type}`, 404);

    return categories.sort((a, b) => a.name.localeCompare(b.name));
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
