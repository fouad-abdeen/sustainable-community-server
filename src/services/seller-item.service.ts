import { Service } from "typedi";
import { BaseService, Context, throwError } from "../core";
import {
  CategoryInfo,
  ExtendedSellerItemData,
  ItemSeller,
  SellerItem,
  SellerProfile,
  User,
  UserRole,
} from "../models";
import {
  CategoryRepository,
  SellerItemRepository,
  UserRepository,
} from "../repositories";
import { SellerItemQuery } from "../controllers/request/seller-item.request";

@Service()
export class SellerItemService extends BaseService {
  constructor(
    private _sellerItemRepository: SellerItemRepository,
    private _userRepository: UserRepository,
    private _categoryRepository: CategoryRepository
  ) {
    super(__filename);
  }

  async getListOfItems(
    conditions: SellerItemQuery
  ): Promise<ExtendedSellerItemData[]> {
    const items = await this._sellerItemRepository.getListOfItems(conditions),
      sellers: ItemSeller[] = [],
      categories: CategoryInfo[] = [];

    return await Promise.all(
      await items.map(async (item) => {
        return await this.getExtendedData(item, sellers, categories);
      })
    );
  }

  async getItem(id: string): Promise<ExtendedSellerItemData> {
    const item = await this._sellerItemRepository.getItem<SellerItem>(id);

    return await this.getExtendedData(item);
  }

  async createItem(item: SellerItem): Promise<ExtendedSellerItemData> {
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

    return this.getExtendedData(
      await this._sellerItemRepository.createItem(item)
    );
  }

  async updateItem(item: SellerItem): Promise<ExtendedSellerItemData> {
    this._logger.info(`Attempting to update item with id: ${item._id}`);

    const user = Context.getUser();

    if (item.sellerId) {
      if (user.role === UserRole.SELLER) {
        if (item.sellerId !== user._id)
          throwError(`Cannot assign an item to another seller`, 403);
      } else {
        const seller = await this._userRepository.getUserById<User>(
          item.sellerId
        );
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

    return await this.getExtendedData(
      await this._sellerItemRepository.updateItem(item)
    );
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

  private async getExtendedData(
    item: SellerItem,
    sellersList: ItemSeller[] = [],
    categoriesList: CategoryInfo[] = []
  ): Promise<ExtendedSellerItemData> {
    const updatedItem = item as ExtendedSellerItemData;

    let seller = sellersList.find((seller) => seller.id === item.sellerId);
    let category = categoriesList.find(
      (category) => category.id === item.categoryId
    );

    if (seller) updatedItem.seller = seller;
    else {
      seller = await this.getItemSeller(item.sellerId);
      sellersList.push(seller);
      updatedItem.seller = seller;
    }

    if (category) updatedItem.category = category;
    else {
      category = await this.getItemCategory(item.categoryId);
      categoriesList.push(category);
      updatedItem.category = category;
    }

    return updatedItem;
  }

  private async getItemSeller(sellerId: string): Promise<ItemSeller> {
    this._logger.info(`Getting seller data for seller with id: ${sellerId}`);

    return (await this._userRepository.getUserById<ItemSeller>(
      sellerId,
      "id name"
    )) as ItemSeller;
  }

  private async getItemCategory(categoryId: string): Promise<CategoryInfo> {
    this._logger.info(
      `Getting item category data for category with id: ${categoryId}`
    );

    return (await this._categoryRepository.getOneCategory<CategoryInfo>(
      categoryId,
      "id name description"
    )) as CategoryInfo;
  }
}
