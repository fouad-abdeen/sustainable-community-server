import { Service } from "typedi";
import { BaseService, Context } from "../core";
import { SellerItem, SellerProfile, UserRole } from "../models";
import {
  CategoryRepository,
  SellerItemRepository,
  UserRepository,
} from "../repositories";

@Service()
export class SellerItemService extends BaseService {
  constructor(
    private _sellerItemRepository: SellerItemRepository,
    private _categoryRepository: CategoryRepository,
    private _userRepository: UserRepository
  ) {
    super(__filename);
  }

  async createItem(item: SellerItem): Promise<SellerItem> {
    this._logger.info(`Attempting to create item with name: ${item.name}`);

    const user = Context.getUser();

    if (item.sellerId !== user._id)
      throw new Error("Cannot create an item for another seller");

    const { profile } = user;
    const itemCategories = (profile as SellerProfile).itemCategories ?? [];

    if (itemCategories.length === 0)
      throw new Error("Seller is not assigned any item categories yet");

    if (!itemCategories.includes(item.categoryId))
      throw new Error(
        `Item category with id ${item.categoryId} is not assigned to the seller`
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
          throw new Error(`Cannot assign an item to another seller`);
      } else {
        const seller = await this._userRepository.getUserById(item.sellerId);
        if (seller.role !== UserRole.SELLER)
          throw new Error("Assigned seller is not a seller");
      }
    }

    if (item.categoryId) {
      const { profile } = user;
      const itemCategories = (profile as SellerProfile).itemCategories ?? [];

      if (!itemCategories.includes(item.categoryId))
        throw new Error(
          `Item category with id ${item.categoryId} is not assigned to the seller`
        );
    }

    if (item.isAvailable) {
      const currentItem = await this._sellerItemRepository.getItem(
        item._id as string
      );
      this.validateAvailability(item, currentItem.quantity);
    }

    return this._sellerItemRepository.updateItem(item);
  }

  async deleteItem(id: string): Promise<void> {
    this._logger.info(`Attempting to delete item with id: ${id}`);

    const user = Context.getUser();

    const item = await this._sellerItemRepository.getItem(id);

    if (item.sellerId !== user._id)
      throw new Error("Cannot delete an item for another seller");

    await this._sellerItemRepository.deleteItem(id);
  }

  private validateAvailability(
    item: SellerItem,
    currentQuantity?: number
  ): void {
    if (item.quantity === 0)
      throw new Error("Item cannot be available with quantity equal to 0");

    if (currentQuantity === 0)
      throw new Error(
        "Item cannot be available while the current quantity is 0"
      );
  }
}
