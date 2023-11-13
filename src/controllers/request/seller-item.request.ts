import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class SellerItemCreationRequest {
  @MinLength(5, { message: "Name cannot be shorter than 5 characters" })
  @MaxLength(75, { message: "Name cannot be longer than 75 characters" })
  @IsString({ message: "Invalid or missing name's value" })
  name: string;

  @MinLength(25, {
    message: "Description cannot be shorter than 25 characters",
  })
  @MaxLength(1000, {
    message: "Description cannot be longer than 1000 characters",
  })
  @IsString({ message: "Invalid description's value" })
  description: string;

  @Min(0.5, { message: "Price should be at least 50 cents" })
  @Max(500, { message: "Price cannot be higher than 500 dollars" })
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
  @Min(0, { message: "Quantity cannot be negative" })
  @IsNumber({}, { message: "Invalid quantity's value" })
  quantity?: number;

  @IsOptional()
  @IsUrl({}, { message: "Invalid image URL" })
  imageUrl?: string;
}

export class SellerItemUpdateRequest {
  @IsOptional()
  @MinLength(5, { message: "Name cannot be shorter than 5 characters" })
  @MaxLength(75, { message: "Name cannot be longer than 75 characters" })
  @IsString({ message: "Invalid name's value" })
  name?: string;

  @IsOptional()
  @MinLength(25, {
    message: "Description cannot be shorter than 25 characters",
  })
  @MaxLength(1000, {
    message: "Description cannot be longer than 1000 characters",
  })
  @IsString({ message: "Invalid description's value" })
  description?: string;

  @IsOptional()
  @Min(0.5, { message: "Price should be at least 50 cents" })
  @Max(500, { message: "Price cannot be higher than 500 dollars" })
  @IsNumber({}, { message: "Invalid price's value" })
  price?: number;

  @IsOptional()
  @IsMongoId({ message: "Invalid category's id" })
  categoryId?: string;

  @IsOptional()
  @IsBoolean({ message: "Invalid availability's value" })
  isAvailable?: boolean;

  @IsOptional()
  @Min(0, { message: "Quantity cannot be negative" })
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
