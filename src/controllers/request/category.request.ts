import { IsEnum } from "class-validator";
import { CategoryType } from "../../models";

export class CategoryRequest {
  @IsEnum(CategoryType)
  type: CategoryType;
}
