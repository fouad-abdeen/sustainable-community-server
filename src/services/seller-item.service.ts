import { Service } from "typedi";
import { BaseService, Context, throwError } from "../core";
import { SellerItem, SellerProfile, UserRole } from "../models";
import { SellerItemRepository, UserRepository } from "../repositories";

@Service()
export class SellerItemService extends BaseService {
  constructor(
    private _sellerItemRepository: SellerItemRepository,
    private _userRepository: UserRepository
  ) {
    super(__filename);
  }

  async createItem(item: SellerItem): Promise<SellerItem> {
    this._logger.info(`Attempting to create item with name: ${item.name}`);

    const user = Context.getUser();

    if (item.sellerId !== user._id)
      throwError("Cannot create an item for another seller", 403);

    const { profile } = user;
    const itemCategories = (profile as SellerProfile).itemCategories ?? [];

    if (itemCategories.length === 0)
      throwError("Cannot create an item without any assigned category", 403);

    if (!itemCategories.includes(item.categoryId))
      throwError(
        `Item category with id ${item.categoryId} is not assigned to the current profile`,
        400
      );

    if (item.isAvailable) this.validateAvailability(item);

    return this._sellerItemRepository.createItem(item);
  }

  async updateItem(item: SellerItem): Promise<SellerItem> {
    this._logger.info(`Attempting to update item with id: ${item._id}`);

    const user = Context.getUser();

    if (item.sellerId) {
      if (user.role === UserRole.SELLER) {
        if (item.sellerId !== user._id)
          throwError(`Cannot assign an item to another seller`, 403);
      } else {
        const seller = await this._userRepository.getUserById(item.sellerId);
        if (seller.role !== UserRole.SELLER)
          throwError("Assigned seller is not a seller", 400);
      }
    }

    if (item.categoryId) {
      const { profile } = user;
      const itemCategories = (profile as SellerProfile).itemCategories ?? [];

      if (!itemCategories.includes(item.categoryId))
        throwError(
          `Item category with id ${item.categoryId} is not assigned to the current profile`,
          400
        );
    }

    if (item.isAvailable) {
      const currentItem = await this._sellerItemRepository.getItem<SellerItem>(
        item._id as string
      );
      this.validateAvailability(item, currentItem.quantity);
    }

    return this._sellerItemRepository.updateItem(item);
  }

  async deleteItem(id: string): Promise<void> {
    this._logger.info(`Attempting to delete item with id: ${id}`);

    const user = Context.getUser();

    const item = await this._sellerItemRepository.getItem<SellerItem>(id);

    if (item.sellerId !== user._id)
      throwError("Cannot delete an item for another seller", 403);

    await this._sellerItemRepository.deleteItem(id);
  }

  private validateAvailability(
    item: SellerItem,
    currentQuantity?: number
  ): void {
    if (item.quantity === 0)
      throwError("Item cannot be available with quantity equal to 0", 400);

    if (currentQuantity === 0)
      throwError(
        "Item cannot be available while the current quantity is 0",
        400
      );
  }
}
