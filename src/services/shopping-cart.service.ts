import { Service } from "typedi";
import { BaseService, throwError } from "../core";
import { CartItem } from "../models";
import { SellerItemRepository, ShoppingCartRepository } from "../repositories";

@Service()
export class ShoppingCartService extends BaseService {
  constructor(
    private _shoppingCartRepository: ShoppingCartRepository,
    private _sellerItemRepository: SellerItemRepository
  ) {
    super(__filename);
  }

  async addItem(ownerId: string, item: CartItem): Promise<void> {
    const originItem = await this.getOriginItem(item.id);

    if (!originItem.isAvailable)
      throwError("Item is not available for purchase", 400);

    if (originItem.price !== item.price)
      throwError("Item price has changed", 400);

    await this._shoppingCartRepository.addItem(
      ownerId,
      item,
      originItem.quantity
    );
  }

  async updateItem(ownerId: string, item: CartItem): Promise<void> {
    const originItem = await this.getOriginItem(item.id);

    if (!originItem.isAvailable)
      throwError("Item is not available for purchase", 400);

    if (item.quantity > originItem.quantity)
      throwError(`Only ${originItem.quantity} items are available`, 400);

    if (originItem.price !== item.price)
      throwError("Item price has changed", 400);

    await this._shoppingCartRepository.updateItem(ownerId, item);
  }

  private getOriginItem(
    id: string
  ): Promise<{ isAvailable: Boolean; quantity: number; price: number }> {
    return this._sellerItemRepository.getItem<{
      isAvailable: Boolean;
      quantity: number;
      price: number;
    }>(id, "isAvailable quantity price");
  }
}
