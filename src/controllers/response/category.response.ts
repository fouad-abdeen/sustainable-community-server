import { Category, CategoryType } from "../../models";

export class CategoryResponse {
  id: string;
  name: string;
  description: string;
  type: CategoryType;
  createdAt?: number;
  createdBy?: string;
  updatedAt?: number;
  updatedBy?: string;

  public static getCategoryResponse(category: Category): CategoryResponse {
    return {
      id: (category._id as string).toString(),
      name: category.name,
      description: category.description,
      type: category.type,
      createdAt: category.createdAt,
      createdBy: category.createdBy,
      updatedAt: category.updatedAt,
      updatedBy: category.updatedBy,
    };
  }

  public static getListOfCategoriesResponse(
    categories: Category[]
  ): CategoryResponse[] {
    return categories.map((category) => this.getCategoryResponse(category));
  }
}
