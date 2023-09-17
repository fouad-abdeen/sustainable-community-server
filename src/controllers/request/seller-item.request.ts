import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class SellerItemCreationRequest {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @MinLength(5, { message: "Name cannot be shorter than 5 characters" })
  @MaxLength(75, { message: "Name cannot be longer than 75 characters" })
  @IsString({ message: "Invalid or missing name's value" })
  name: string;

  @IsNotEmpty({ message: "Description cannot be empty" })
  @MinLength(100, {
    message: "Description cannot be shorter than 100 characters",
  })
  @MaxLength(1000, {
    message: "Description cannot be longer than 1000 characters",
  })
  @IsString({ message: "Invalid description's value" })
  description: string;

  @Min(0, { message: "Price cannot be negative" })
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
  @MinLength(100, {
    message: "Description cannot be shorter than 100 characters",
  })
  @MaxLength(1000, {
    message: "Description cannot be longer than 1000 characters",
  })
  @IsString({ message: "Invalid description's value" })
  descripsction?: string;

  @IsOptional()
  @Min(0, { message: "Price cannot be negative" })
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
