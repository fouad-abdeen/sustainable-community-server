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

      if (category.type !== currentType) {
        const isAssignedToSellers =
          await this.checkIfCategoryIsAssignedToSellers(id);

        if (isAssignedToSellers)
          throwError(
            "Cannot update the type of a category that is assigned to sellers",
            400
          );
      }
    }

    return await this._categoryRepository.updateCategory({
      _id: id,
      ...category,
    } as Category);
  }

  async deleteCategory(id: string): Promise<void> {
    this._logger.info(`Attempting to delete category with id: ${id}`);

    const isAssignedToSellers = await this.checkIfCategoryIsAssignedToSellers(
      id
    );

    if (isAssignedToSellers)
      throwError("Cannot delete a category that is assigned to sellers", 400);

    await this._categoryRepository.deleteCategory(id);
  }

  private async checkIfCategoryIsAssignedToSellers(
    categoryId: string
  ): Promise<boolean> {
    const sellers = await this._sellerRepository.getListOfSellers(
      "profile.categoryId profile.itemCategories"
    );

    return (
      sellers.findIndex(
        (seller) =>
          seller.categoryId === categoryId ||
          (seller.itemCategories ?? []).findIndex(
            (itemCategoryId) => itemCategoryId === categoryId
          ) > -1
      ) > -1
    );
  }
}
