import { Service } from "typedi";
import { BaseService, Context, throwError } from "../core";
import { SellerItem, SellerProfile, User, UserRole } from "../models";
import {
  CategoryRepository,
  SellerItemRepository,
  UserRepository,
} from "../repositories";

@Service()
export class SellerItemService extends BaseService {
  constructor(
    private _SellerItemRepository: SellerItemRepository,
    private _userRepository: UserRepository,
    private _categoryRepository: CategoryRepository
  ) {
    super(__filename);
  }

  async createItem(item: SellerItem): Promise<SellerItem> {
    this._logger.info(`Attempting to create item with name: ${item.name}`);

    const user = Context.getUser();

    if (item.sellerId !== user._id)
      throwError("Cannot create an item for another seller", 403);

    const defaultItemCategory =
      await this._categoryRepository.getDefaultItemCategory();

    const { profile } = user;
    const itemCategories = (profile as SellerProfile).itemCategories ?? [
      (defaultItemCategory._id ?? "").toString(),
    ];

    if (!itemCategories.includes(item.categoryId))
      throwError(
        `Item category with id ${item.categoryId} is not assigned to the current profile`,
        400
      );

    if (item.isAvailable) this.validateAvailability(item);

    const createdItem = await this._SellerItemRepository.createItem(item);

    await this._userRepository.updateUser({
      _id: user._id,
      profile: {
        ...profile,
        itemsCount: ((profile as SellerProfile).itemsCount ?? 0) + 1,
      },
    } as User);

    return createdItem;
  }

  async updateItem(item: SellerItem): Promise<SellerItem> {
    this._logger.info(`Attempting to update item with id: ${item._id}`);

    const user = Context.getUser();
    const seller =
      user.role === UserRole.ADMIN
        ? await this._userRepository.getUserById<User>(item.sellerId)
        : ({} as User);

    if (item.sellerId) {
      if (user.role === UserRole.SELLER) {
        if (item.sellerId !== user._id)
          throwError(`Cannot assign an item to another seller`, 403);
      } else if (seller.role !== UserRole.SELLER)
        throwError("Assigned seller is not a seller", 400);
    }

    if (item.categoryId) {
      const defaultItemCategory =
        await this._categoryRepository.getDefaultItemCategory();

      const { profile } = user.role === UserRole.ADMIN ? seller : user;
      const itemCategories = (profile as SellerProfile).itemCategories ?? [
        (defaultItemCategory._id ?? "").toString(),
      ];

      if (!itemCategories.includes(item.categoryId))
        throwError(
          `Item category with id ${item.categoryId} is not assigned to the current profile`,
          400
        );
    }

    if (item.isAvailable) {
      const currentItem = await this._SellerItemRepository.getItem<SellerItem>(
        item._id as string
      );
      this.validateAvailability(item, currentItem.quantity);
    }

    return await this._SellerItemRepository.updateItem(item);
  }

  async deleteItem(id: string): Promise<void> {
    this._logger.info(`Attempting to delete item with id: ${id}`);

    const user = Context.getUser();

    const item = await this._SellerItemRepository.getItem<SellerItem>(id);

    if (item.sellerId !== user._id)
      throwError("Cannot delete an item for another seller", 403);

    await this._SellerItemRepository.deleteItem(id);

    await this._userRepository.updateUser({
      _id: user._id,
      profile: {
        ...user.profile,
        itemsCount: ((user.profile as SellerProfile).itemsCount as number) - 1,
      },
    } as User);
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
