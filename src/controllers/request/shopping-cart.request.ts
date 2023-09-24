import { IsMongoId, IsNumber, Min } from "class-validator";

export class CartItemRequest {
  @IsMongoId({ message: "Invalid or missing item's id" })
  id: string;

  @Min(1, { message: "Quantity cannot be less than 1" })
  @IsNumber(undefined, { message: "Invalid or missing item's quantity" })
  quantity: number;
}
