import { CategoryInfo, SellerInfo, SellerProfile, User } from "../../models";
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
   * @param profile the profile of the seller
   */
  updateCategory(
    userId: string,
    categoryId: string,
    profile: SellerProfile
  ): Promise<void>;

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
   * @param categories ids list of the seller's categories
   */
  getItemCategories(
    user: string,
    categories: string[]
  ): Promise<CategoryInfo[]>;

  /**
   * Gets list of sellers
   * @param projection the projection of the query
   * @param activeSellers if true, returns only active sellers
   */
  getListOfSellers(
    projection: string,
    activeSellers: boolean
  ): Promise<SellerInfo[]>;

  /**
   * Gets a seller by id
   * @param userId id of the seller
   */
  getSeller(userId: string): Promise<SellerInfo>;
}
