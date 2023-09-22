import {
  IsMongoId,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CartItemRequest {
  @IsMongoId({ message: "Invalid or missing item's id" })
  id: string;

  @MinLength(5, { message: "Name cannot be shorter than 5 characters" })
  @MaxLength(75, { message: "Name cannot be longer than 75 characters" })
  @IsString({ message: "Invalid or missing item's name" })
  name: string;

  @Min(0, { message: "Price cannot be negative" })
  @IsNumber(undefined, { message: "Invalid or missing item's price" })
  price: number;

  @Min(1, { message: "Quantity cannot be less than 1" })
  @IsNumber(undefined, { message: "Invalid or missing item's quantity" })
  quantity: number;

  @IsUrl(undefined, { message: "Invalid item's image url" })
  imageUrl?: string;
}

export class CartItemQueryParams {
  @IsMongoId({ message: "Invalid or missing item's id" })
  id: string;

  @Min(1, { message: "Quantity cannot be less than 1" })
  @IsNumber(undefined, { message: "Invalid or missing item's quantity" })
  quantity: number;
}
