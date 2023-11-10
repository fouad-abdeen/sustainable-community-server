import { Category, CategoryType } from "../../models";

export class CategoryResponse {
  id: string;
  name: string;
  type: CategoryType;
  description?: string;
  createdAt?: number;
  updatedAt?: number;

  public static getCategoryResponse(category: Category): CategoryResponse {
    return {
      id: (category._id as string).toString(),
      name: category.name,
      type: category.type,
      description: category.description,
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
