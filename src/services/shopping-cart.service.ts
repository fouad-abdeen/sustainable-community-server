import { Service } from "typedi";
import { BaseService, Context, throwError } from "../core";
import { CartItem, SellerItem, ShoppingCart } from "../models";
import { SellerItemRepository, ShoppingCartRepository } from "../repositories";
import { CartItemRequest } from "../controllers/request";

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

    if (!cart) return await this._shoppingCartRepository.createCart(ownerId);

    return await this.updateCart(cart);
  }

  async updateCart(
    cart: ShoppingCart,
    checkout?: boolean
  ): Promise<ShoppingCart> {
    const updatedCart = { ...cart };

    updatedCart.items = await (Promise.all(
      cart.items.map(async (item) => {
        const sellerItem = await this.getSellerItem(item.id);

        if (checkout) {
          if (sellerItem.quantity < 1)
            throwError(`The item ${sellerItem.name} is out of stock`, 400);

          if (!sellerItem.isAvailable)
            throwError(`The item ${sellerItem.name} is not available`, 400);

          if (item.quantity > sellerItem.quantity)
            throwError(
              `The item ${sellerItem.name} has only ${sellerItem.quantity} left in stock`,
              400
            );

          if (item.quantity < 1 || item.quantity > 5)
            throwError(
              `The requested quantity of the item ${item.name} is invalid`,
              400
            );
        }

        if (sellerItem.quantity < 1 || !sellerItem.isAvailable)
          item.quantity = 0;

        if (item.quantity > sellerItem.quantity)
          item.quantity = sellerItem.quantity;

        item.price = sellerItem.price;
        item.name = sellerItem.name;
        item.imageUrl = sellerItem.imageUrl;

        return item;
      })
    ) as Promise<CartItem[]>);

    updatedCart.total = updatedCart.items.reduce(
      (total, item) => total + (item ? item.price * item.quantity : 0),
      0
    );

    return await this._shoppingCartRepository.updateCart(updatedCart);
  }

  async addItem(ownerId: string, item: CartItemRequest): Promise<void> {
    const sellerItem = await this.getSellerItem(item.id);

    const cart =
      (await this._shoppingCartRepository.getCart(ownerId)) ??
      (await this._shoppingCartRepository.createCart(ownerId));

    const itemExistingInCart = cart.items.find(
      (cartItem) => cartItem.id === item.id
    );

    if (itemExistingInCart) {
      await this.updateItem(ownerId, {
        id: item.id,
        quantity: itemExistingInCart.quantity + item.quantity,
      });
      return;
    }

    this.validateItemAvailability(sellerItem, item.quantity);

    await this._shoppingCartRepository.addItem(ownerId, {
      ...item,
      sellerId: sellerItem.sellerId,
      price: sellerItem.price,
      name: sellerItem.name,
      imageUrl: sellerItem.imageUrl,
    });
  }

  async updateItem(ownerId: string, item: CartItemRequest): Promise<void> {
    const sellerItem = await this.getSellerItem(item.id);

    this.validateItemAvailability(sellerItem, item.quantity);

    await this._shoppingCartRepository.updateItem(ownerId, {
      ...item,
      sellerId: sellerItem.sellerId,
      price: sellerItem.price,
      name: sellerItem.name,
      imageUrl: sellerItem.imageUrl,
    });
  }

  private validateItemAvailability(item: SellerItem, requestedQuantity): void {
    if (item.quantity < 1)
      throwError("Item is out of stock at the moment", 400);

    if (!item.isAvailable)
      throwError("Item is not available now for purchase", 400);

    if (requestedQuantity > 5)
      throwError(
        `You cannot add more than 5 items of the same type to the cart`,
        400
      );

    if (requestedQuantity > item.quantity)
      throwError(
        `Not enough in-stock items available, only ${item.quantity} left`,
        400
      );
  }

  private async getSellerItem(id: string): Promise<SellerItem> {
    const item = await this._sellerItemRepository.getItem<SellerItem>(
      id,
      undefined,
      true
    );

    if (!item) {
      const userId = Context.getUser()._id as string;
      await this._shoppingCartRepository.removeItem(userId, id);
      throwError(`Item with id ${id} does not exist anymore`, 400);
    }

    return item;
  }
}
