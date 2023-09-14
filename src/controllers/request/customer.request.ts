import { IsMongoId } from "class-validator";

export class WhishlistQueryParams {
  @IsMongoId({ message: "Invalid or missing item's id" })
  itemId: string;
}
