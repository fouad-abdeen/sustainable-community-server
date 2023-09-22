import { IsInstance, IsNumber, IsString } from "class-validator";
import { CartItem } from "../../models";
import { ShoppingCart } from "../../models/shopping-cart.model";

export class ShoppingCartResponse {
  @IsString()
  id: string;

  @IsString()
  ownerId: string;

  @IsNumber()
  total: number;

  @IsInstance(CartItem, { each: true })
  items: CartItem[];

  @IsNumber()
  updatedAt?: number;

  public static getCartResponse(cart: ShoppingCart): ShoppingCartResponse {
    return {
      id: (cart._id as string).toString(),
      ownerId: cart.ownerId,
      total: cart.total,
      items: cart.items,
      updatedAt: cart.updatedAt,
    };
  }
}
