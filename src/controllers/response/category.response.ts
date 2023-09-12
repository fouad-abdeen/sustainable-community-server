import { Category, CategoryType } from "../../models";

export class CategoryResponse {
  id: string;
  name: string;
  description: string;
  type: CategoryType;
  createdAt?: number;
  updatedAt?: number;

  public static getCategoryResponse(category: Category): CategoryResponse {
    return {
      id: category._id as string,
      name: category.name,
      description: category.description,
      type: category.type,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  public static getListOfCategoriesResponse(
    categories: Category[]
  ): CategoryResponse[] {
    return categories.map((category) => this.getCategoryResponse(category));
  }
}
