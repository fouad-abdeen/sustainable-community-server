import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { CategoryType } from "../../models";

export class CategoryCreationRequest {
  @MinLength(5, { message: "Name cannot be shorter than 5 characters" })
  @MaxLength(50, { message: "Name cannot be longer than 50 characters" })
  @IsString({ message: "Invalid or missing name's value" })
  name: string;

  @IsEnum(CategoryType, { message: "Invalid category type" })
  type: CategoryType;

  @IsOptional()
  @MinLength(10, {
    message: "Description cannot be shorter than 10 characters",
  })
  @MaxLength(250, {
    message: "Description cannot be longer than 250 characters",
  })
  @IsString({ message: "Invalid or missing description's value" })
  description: string;
}

export class CategoryUpdateRequest {
  @IsOptional()
  @MinLength(5, { message: "Name cannot be shorter than 5 characters" })
  @MaxLength(50, { message: "Name cannot be longer than 50 characters" })
  @IsString({ message: "Invalid name's value" })
  name?: string;

  @IsOptional()
  @IsEnum(CategoryType, { message: "Invalid category type" })
  type?: CategoryType;

  @IsOptional()
  @MinLength(10, {
    message: "Description cannot be shorter than 10 characters",
  })
  @MaxLength(250, {
    message: "Description cannot be longer than 250 characters",
  })
  @IsString({ message: "Invalid description's value" })
  description?: string;
}

export class CategoryQuery {
  @IsOptional()
  @IsEnum(CategoryType, { message: "Invalid category type" })
  type?: CategoryType;
}
