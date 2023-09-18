import { Service } from "typedi";
import { ICustomerRepository, WishlistItem } from "./interfaces";
import { UserRepository } from "./user.repository";
import { CustomerProfile, User } from "../models";
import { Context, throwError } from "../core";
import { SellerItemRepository } from "./seller-item.repository";

@Service()
export class CustomerRepository
  extends UserRepository
  implements ICustomerRepository
{
  constructor(private _sellerItemRepository: SellerItemRepository) {
    super();
  }

  async addItemToWishlist(userId: string, itemId: string): Promise<void> {
    this._logger.info(
      `Adding item with id: ${itemId} to wishlist of user with id: ${userId}`
    );

    const user = Context.getUser();
    const wishlist = (user.profile as CustomerProfile).wishlist ?? [];

    if (wishlist.includes(itemId)) {
      throwError(`Item with id ${itemId} already exists in the wishlist`, 400);
    }

    wishlist.push(itemId);

    await this.updateUser({
      _id: userId,
      profile: { ...user.profile, wishlist },
    } as User);
  }

  async removeItemFromWishlist(userId: string, itemId: string): Promise<void> {
    this._logger.info(
      `Removing item with id: ${itemId} from wishlist of user with id: ${userId}`
    );

    const user = await this.getUserById(userId);
    const wishlist = (user.profile as CustomerProfile).wishlist ?? [];

    if (!wishlist.includes(itemId)) {
      throwError(`Item with id ${itemId} does not exist in the wishlist`, 400);
    }

    const itemIndex = wishlist.indexOf(itemId);
    wishlist.splice(itemIndex, 1);

    await this.updateUser({
      _id: userId,
      profile: { ...user.profile, wishlist },
    } as User);
  }

  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    this._logger.info(`Getting wishlist items of user with id: ${userId}`);

    const user = Context.getUser();
    const wishlist = (user.profile as CustomerProfile).wishlist ?? [];

    return await Promise.all(
      wishlist.map(async (itemId) => {
        const wishlistItem = {
          id: itemId,
          ...(await this._sellerItemRepository.getItem<WishlistItem>(
            itemId,
            "name description price imageUrl"
          )),
        };
        delete wishlistItem["_id"];
        return wishlistItem;
      })
    );
  }

  async updateProfile(userId: string, profile: CustomerProfile): Promise<void> {
    this._logger.info(`Updating profile of user with id: ${userId}`);
    const profileKeys = ["firstName", "lastName", "phoneNumber", "address"];
    Object.keys(profile).forEach((key) => {
      if (!profileKeys.includes(key)) delete profile[key];
    });
    await this.updateUser({ _id: userId, profile } as User);
  }
}
