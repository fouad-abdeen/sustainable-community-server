import { Service } from "typedi";
import { BaseService, Context } from "../core";
import { SellerItem, UserRole } from "../models";
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
    await this.validateItem(item);
    return this._sellerItemRepository.createItem(item);
  }

  async updateItem(item: SellerItem): Promise<SellerItem> {
    this._logger.info(`Attempting to update item with id: ${item._id}`);
    await this.validateItem(item);
    return this._sellerItemRepository.updateItem(item);
  }

  async deleteItem(id: string): Promise<void> {
    this._logger.info(`Attempting to delete item with id: ${id}`);
    let item: SellerItem;

    try {
      item = await this._sellerItemRepository.getItem(id);
    } catch (error) {
      throw new Error(`Item with id ${id} does not exist`);
    }

    const user = Context.getUser();

    if (
      (item.sellerId !== user._id && user.role !== UserRole.ADMIN) ||
      (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN)
    )
      throw new Error("Unauthorized to delete an item");

    await this._sellerItemRepository.deleteItem(id);
  }

  private async validateItem(item: SellerItem): Promise<void> {
    // To-DO: Use class-validator decorators to reduce validations here

    if (item.name)
      if (item.name.length > 75)
        throw new Error("Name cannot be longer than 75");

    if (item.description)
      if (item.description.length > 600)
        throw new Error("Description cannot be longer than 600");

    if (item.price)
      if (item.price <= 0) throw new Error("Price cannot be negative or zero");

    if (item.categoryId) {
      try {
        await this._categoryRepository.getOneCategory(item.categoryId);
      } catch (error) {
        throw new Error(`Category with id ${item.categoryId} does not exist`);
      }
    }

    if (item.sellerId) {
      const user = Context.getUser();

      // Only sellers and admins can manage items
      // Sellers can only manage items for themselves
      // Admins can manage items for any seller
      if (
        (item.sellerId !== user._id && user.role !== UserRole.ADMIN) ||
        (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN)
      )
        throw new Error("Unauthorized to create or update an item");

      const seller = await this._userRepository.getUserById(item.sellerId);

      if (seller.role !== UserRole.SELLER)
        throw new Error("Assigned seller is not a seller");
    }

    if (item.quantity) {
      if (item.quantity < 0) throw new Error("Quantity cannot be negative");

      if (item.isAvailable === true && item.quantity === 0)
        throw new Error("Item cannot be available with quantity equal to 0");
    }

    if (item.isAvailable)
      if (item._id) {
        const { quantity } = await this._sellerItemRepository.getItem(item._id);
        if (quantity === 0)
          throw new Error(
            "Item cannot be available while the current quantity is 0"
          );
      }
  }
}
