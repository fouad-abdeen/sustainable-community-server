import { Category, CategoryType } from "../../models";

export interface ICategoryRepository {
  /**
   * Gets one category by id
   * @param id id of the category
   * @param projection optional fields to return
   */
  getOneCategory<C>(id: string, projection?: string): Promise<Category | C>;

  /**
   * Gets a list of categories by type
   * @param type type of category
   */
  getListOfCategories(type?: CategoryType): Promise<Category[]>;

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
