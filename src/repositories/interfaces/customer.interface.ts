import { CustomerProfile } from "../../models";
import { IUserRepository } from "./user.interface";

export interface ICustomerRepository extends IUserRepository {
  /**
   * Adds an item to the customer's whishlist
   * @param userId id of the customer
   * @param itemId id of the item to add to the whishlist
   */
  addItemToWhishlist(userId: string, itemId: string): Promise<void>;

  /**
   * Removes an item from the customer's whishlist
   * @param userId id of the customer
   * @param itemId id of the item to remove from the whishlist
   */
  removeItemFromWhishlist(userId: string, itemId: string): Promise<void>;

  /**
   * Updates the profile of a customer
   * @param userId id of the customer
   * @param profile the new profile data
   */
  updateProfile(userId: string, profile: CustomerProfile): Promise<void>;
}
