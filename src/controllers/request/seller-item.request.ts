import { IsBoolean, IsOptional, IsString } from "class-validator";

export class SellerItemRequest {
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
