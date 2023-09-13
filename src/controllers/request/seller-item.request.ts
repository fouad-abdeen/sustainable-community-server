import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class SellerItemCreationRequest {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  categoryId: string;

  @IsString()
  sellerId: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsUrl({}, { message: "Invalid image URL" })
  imageUrl?: string;
}

export class SellerItemUpdateRequest {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  sellerId?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsUrl({}, { message: "Invalid image URL" })
  imageUrl?: string;
}

export class SellerItemQuery {
  @IsOptional()
  @IsString()
  sellerId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
