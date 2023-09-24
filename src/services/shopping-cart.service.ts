import { Service } from "typedi";
import { BaseService, throwError } from "../core";
import { CartItem, SellerItem, ShoppingCart } from "../models";
import { SellerItemRepository, ShoppingCartRepository } from "../repositories";
import { CartItemRequest } from "../controllers/request/shopping-cart.request";

@Service()
export class ShoppingCartService extends BaseService {
  constructor(
    private _shoppingCartRepository: ShoppingCartRepository,
    private _sellerItemRepository: SellerItemRepository
  ) {
    super(__filename);
  }

  async getCart(ownerId: string): Promise<ShoppingCart> {
    const cart = await this._shoppingCartRepository.getCart(ownerId);

    return await this.updateCart(cart);
  }

  async updateCart(cart: ShoppingCart): Promise<ShoppingCart> {
    const updatedCart = { ...cart };

    updatedCart.items = await (Promise.all(
      cart.items.map(async (item) => {
        const originItem = await this.getOriginItem(item.id);

        if (originItem.quantity < 1) {
          item.isAvailable = false;
          item.availability = 0;
        } else {
          item.isAvailable = originItem.isAvailable;
          item.availability = originItem.quantity;
        }

        item.price = originItem.price;
        item.name = originItem.name;
        item.imageUrl = originItem.imageUrl;

        return item;
      })
    ) as Promise<CartItem[]>);

    updatedCart.total = updatedCart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return await this._shoppingCartRepository.updateCart(updatedCart);
  }

  async addItem(ownerId: string, item: CartItemRequest): Promise<void> {
    const originItem = await this.getOriginItem(item.id);

    if (originItem.quantity < 1)
      throwError("Item is out of stock at the moment", 400);

    if (!originItem.isAvailable)
      throwError("Item is not available now for purchase", 400);

    if (item.quantity > originItem.quantity)
      throwError(
        `Not enough in-stock items available, only ${originItem.quantity} left`,
        400
      );

    const cartItem = {
      ...item,
      price: originItem.price,
      availability: originItem.quantity,
      isAvailable: originItem.isAvailable,
      name: originItem.name,
      imageUrl: originItem.imageUrl,
    };

    await this._shoppingCartRepository.addItem(ownerId, cartItem);
  }

  async updateItem(ownerId: string, item: CartItem): Promise<void> {
    const { id, quantity } = item;

    const originItem = await this.getOriginItem(id);

    const {
      price,
      isAvailable,
      quantity: availability,
      name,
      imageUrl,
    } = originItem;

    if (availability < 1) throwError("Item is out of stock at the moment", 400);

    if (!isAvailable) throwError("Item is not available now for purchase", 400);

    if (quantity > availability)
      throwError(
        `Not enough in-stock items available, only ${availability} left`,
        400
      );

    await this._shoppingCartRepository.updateItem(ownerId, {
      id,
      quantity,
      price,
      isAvailable,
      availability,
      name,
      imageUrl,
    });
  }

  private getOriginItem(id: string): Promise<SellerItem> {
    return this._sellerItemRepository.getItem<SellerItem>(id);
  }
}
