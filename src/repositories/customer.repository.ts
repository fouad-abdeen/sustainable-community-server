import Container, { Service } from "typedi";
import { ICustomerRepository } from "./interfaces";
import { CustomerProfile, SellerItem, User, WishlistItem } from "../models";
import { Context, throwError } from "../core";
import { SellerItemRepository, UserRepository } from ".";

@Service()
export class CustomerRepository
  extends UserRepository
  implements ICustomerRepository
{
  constructor(private _menuItemRepository: SellerItemRepository) {
    super();
    if (!this._menuItemRepository)
      this._menuItemRepository = Container.get(SellerItemRepository);
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

    const user = await this.getUserById<User>(userId);
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
        const item = await this._menuItemRepository.getItem<WishlistItem>(
          itemId,
          "name description price imageUrl sellerId",
          true
        );

        delete item["_id"];

        if (!item)
          this.updateProfile(userId, {
            wishlist: wishlist.filter((id) => id !== itemId),
          } as CustomerProfile);

        return {
          id: itemId,
          ...item,
        };
      })
    );
  }

  async updateProfile(userId: string, profile: CustomerProfile): Promise<void> {
    this._logger.info(`Updating profile of user with id: ${userId}`);

    const profileKeys = ["firstName", "lastName", "phoneNumber", "address"];

    Object.keys(profile).forEach((key) => {
      if (!profileKeys.includes(key)) delete profile[key];
    });

    const { profile: currentProfile } = Context.getUser();

    await this.updateUser({
      _id: userId,
      profile: {
        ...currentProfile,
        ...profile,
      },
    } as User);
  }
}
