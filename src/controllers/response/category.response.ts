import { IsEnum, IsNumber, IsString } from "class-validator";
import { Category, CategoryType } from "../../models";

export class CategoryResponse {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(CategoryType)
  type: CategoryType;

  @IsNumber()
  createdAt?: number;

  @IsString()
  createdBy?: string;

  @IsNumber()
  updatedAt?: number;

  @IsString()
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
