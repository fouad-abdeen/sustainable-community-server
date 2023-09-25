import { IsEnum, IsMongoId, IsOptional } from "class-validator";
import { OrderStatus } from "../../models";

export class OrderUpdateRequest {
  @IsMongoId({ message: "Invalid or missing order's id" })
  id: string;

  @IsEnum(OrderStatus, { message: "Invalid or missing order's status" })
  status: OrderStatus;
}

export class OrderQuery {
  @IsOptional()
  @IsMongoId({ message: "Invalid seller's id" })
  sellerId?: string;

  @IsOptional()
  @IsMongoId({ message: "Invalid customer's id" })
  customerId?: string;

  @IsOptional()
  @IsEnum(OrderStatus, { message: "Invalid order's status" })
  status?: OrderStatus;
}
