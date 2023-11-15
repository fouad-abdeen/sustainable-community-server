import { Service } from "typedi";
import { BaseService, throwError } from "../core";
import { CategoryRepository, SellerRepository } from "../repositories";
import { Category, CategoryType } from "../models";
import { CategoryUpdateRequest } from "../controllers/request";

@Service()
export class CategoryService extends BaseService {
  constructor(
    private _categoryRepository: CategoryRepository,
    private _sellerRepository: SellerRepository
  ) {
    super(__filename);
  }

  async updateCategory(
    id: string,
    category: CategoryUpdateRequest
  ): Promise<Category> {
    this._logger.info(`Attempting to update category with id: ${id}`);

    if (category.type) {
      const currentType = (
        await this._categoryRepository.getOneCategory<{ type: CategoryType }>(
          id,
          "type"
        )
      ).type;

      if (category.type !== currentType)
        await this.validateCategoryAvailability(id, "UPDATE");
    }

    return await this._categoryRepository.updateCategory({
      _id: id,
      ...category,
    } as Category);
  }

  async deleteCategory(id: string): Promise<void> {
    this._logger.info(`Attempting to delete category with id: ${id}`);

    await this.validateCategoryAvailability(id, "DELETE");

    await this._categoryRepository.deleteCategory(id);
  }

  private async validateCategoryAvailability(
    categoryId: string,
    action: "UPDATE" | "DELETE"
  ): Promise<void> {
    const sellers = await this._sellerRepository.getListOfSellers(
      "profile.categoryId profile.itemCategories"
    );

    sellers.forEach((seller) => {
      if (seller.categoryId === categoryId)
        throwError(
          action === "UPDATE"
            ? "Cannot update a service category that is associated to sellers"
            : "Cannot delete a service category that is associated to sellers",
          400
        );

      if ((seller.itemCategories ?? []).includes(categoryId))
        throwError(
          action === "UPDATE"
            ? "Cannot update an item category that is assigned to sellers"
            : "Cannot delete an item category that is assigned to sellers",
          400
        );
    });
  }
}
