import { Category, CategoryType } from "../../models";

export interface ICategoryRepository {
  /**
   * Gets one category by id
   * @param id id of the category
   */
  getOneCategory(id: string): Promise<Category>;

  /**
   * Gets a list of categories by type
   * @param type type of category
   */
  getListOfCategories(type: CategoryType): Promise<Category[]>;
}
