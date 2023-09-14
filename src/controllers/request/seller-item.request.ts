import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class SellerItemCreationRequest {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Invalid or missing name's value" })
  name: string;

  @IsNotEmpty({ message: "Description cannot be empty" })
  @IsString({ message: "Invalid description's value" })
  description: string;

  @IsNumber({}, { message: "Invalid or missing price's value" })
  price: number;

  @IsMongoId({ message: "Invalid or missing category's id" })
  categoryId: string;

  @IsMongoId({ message: "Invalid or missing seller's id" })
  sellerId: string;

  @IsOptional()
  @IsBoolean({ message: "Invalid availability's value" })
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber({}, { message: "Invalid quantity's value" })
  quantity?: number;

  @IsOptional()
  @IsUrl({}, { message: "Invalid image URL" })
  imageUrl?: string;
}

export class SellerItemUpdateRequest {
  @IsOptional()
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Invalid name's value" })
  name?: string;

  @IsOptional()
  @IsNotEmpty({ message: "Description cannot be empty" })
  @IsString({ message: "Invalid description's value" })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: "Invalid price's value" })
  price?: number;

  @IsOptional()
  @IsMongoId({ message: "Invalid category's id" })
  categoryId?: string;

  @IsOptional()
  @IsMongoId({ message: "Invalid seller's id" })
  sellerId?: string;

  @IsOptional()
  @IsBoolean({ message: "Invalid availability's value" })
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber({}, { message: "Invalid quantity's value" })
  quantity?: number;

  @IsOptional()
  @IsUrl({}, { message: "Invalid image URL" })
  imageUrl?: string;
}

export class SellerItemQuery {
  @IsOptional()
  @IsMongoId({ message: "Invalid seller's id" })
  sellerId?: string;

  @IsOptional()
  @IsMongoId({ message: "Invalid category's id" })
  categoryId?: string;

  @IsOptional()
  @IsBoolean({ message: "Invalid availability's value" })
  isAvailable?: boolean;
}
