import { Service } from "typedi";
import { BaseService, Context } from "../core";
import { Category, User, UserRole } from "../models";
import { CategoryRepository } from "../repositories";

@Service()
export class CategoryService extends BaseService {
  constructor(private _categoryRepository: CategoryRepository) {
    super(__filename);
  }

  async createCategory(category: Category): Promise<Category> {
    this._logger.info(
      `Attempting to create category with name: ${category.name}`
    );
    this.verifyUser("create");
    return await this._categoryRepository.createCategory(category);
  }

  async updateCategory(category: Category): Promise<Category> {
    this._logger.info(`Attempting to update category with id: ${category._id}`);
    this.verifyUser("update");
    return await this._categoryRepository.updateCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    this._logger.info(`Attempting to delete category with id: ${id}`);
    this.verifyUser("delete");
    await this._categoryRepository.deleteCategory(id);
  }

  // TO-DO: Create a custom decorator to verify user permissions
  private verifyUser(action: string): void {
    const user = Context.getUser();
    if (user.role !== UserRole.ADMIN)
      throw new Error(`Unauthorized to ${action} a category`);
  }
}
