import { CustomerProfile } from "../../models";
import { IUserRepository } from "./user.interface";

export interface ICustomerRepository extends IUserRepository {
  /**
   * Adds an item to the customer's wishlist
   * @param userId id of the customer
   * @param itemId id of the item to add to the wishlist
   */
  addItemToWishlist(userId: string, itemId: string): Promise<void>;

  /**
   * Removes an item from the customer's wishlist
   * @param userId id of the customer
   * @param itemId id of the item to remove from the wishlist
   */
  removeItemFromWishlist(userId: string, itemId: string): Promise<void>;

  /**
   * Gets the wishlist items of a customer
   * @param userId id of the customer
   */
  getWishlistItems(userId: string): Promise<WishlistItem[]>;

  /**
   * Updates the profile of a customer
   * @param userId id of the customer
   * @param profile the new profile data
   */
  updateProfile(userId: string, profile: CustomerProfile): Promise<void>;
}

export interface WishlistItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}
