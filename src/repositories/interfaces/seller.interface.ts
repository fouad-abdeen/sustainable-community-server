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
}
