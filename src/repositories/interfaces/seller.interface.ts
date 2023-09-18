import { SellerProfile } from "../../models";
import { IUserRepository } from "./user.interface";

export interface ISellerRepository extends IUserRepository {
  /**
   * Updates the profile of a seller
   * @param userId id of the seller
   * @param profile the new profile data
   */
  updateProfile(userId: string, profile: SellerProfile): Promise<void>;

  /**
   * Updates the category of a seller
   * @param userId id of the seller
   * @param categoryId id of the category
   */
  updateCategory(userId: string, categoryId: string): Promise<void>;

  /**
   * Assigns an item category to a seller
   * @param userId id of the seller
   * @param categoryId id of the category
   * @param profile the profile of the seller
   */
  assignItemCategory(
    userId: string,
    categoryId: string,
    profile: SellerProfile
  ): Promise<void>;

  /**
   * Removes an item category from a seller
   * @param userId id of the seller
   * @param categoryId id of the category
   * @param profile the profile of the seller
   */
  removeItemCategory(
    userId: string,
    categoryId: string,
    profile: SellerProfile
  ): Promise<void>;

  /**
   * Gets the item categories of a seller
   * @param userId id of the seller
   */
  getItemCategories(userId: string): Promise<ItemCategory[]>;
}

export interface ItemCategory {
  id: string;
  name: string;
  description: string;
}
