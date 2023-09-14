import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CategoryType } from "../../models";

export class CategoryCreationRequest {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Invalid or missing name's value" })
  name: string;

  @IsNotEmpty({ message: "Description cannot be empty" })
  @IsString({ message: "Invalid or missing description's value" })
  description: string;

  @IsEnum(CategoryType, { message: "Invalid category type" })
  type: CategoryType;
}

export class CategoryUpdateRequest {
  @IsOptional()
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Invalid name's value" })
  name?: string;

  @IsOptional()
  @IsNotEmpty({ message: "Description cannot be empty" })
  @IsString({ message: "Invalid description's value" })
  description?: string;

  @IsOptional()
  @IsEnum(CategoryType, { message: "Invalid category type" })
  type?: CategoryType;
}

export class CategoryQuery {
  @IsEnum(CategoryType, { message: "Invalid category type" })
  type: CategoryType;
}
