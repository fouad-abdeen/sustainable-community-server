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

  /**
   * Creates a new category
   * @param category the category to be created
   */
  createCategory(category: Category): Promise<Category>;

  /**
   * Updates an existing category
   * @param category the category to be updated
   */
  updateCategory(category: Category): Promise<Category>;

  /**
   * Deletes an existing category
   * @param id id of the category to be deleted
   */
  deleteCategory(id: string): Promise<void>;
}
