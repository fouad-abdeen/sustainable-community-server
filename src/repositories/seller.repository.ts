import { Service } from "typedi";
import { ISellerRepository } from "./interfaces";
import {
  CategoryInfo,
  SellerInfo,
  SellerProfile,
  User,
  UserRole,
} from "../models";
import { Context, throwError } from "../core";
import { CategoryRepository, UserRepository } from ".";

@Service()
export class SellerRepository
  extends UserRepository
  implements ISellerRepository
{
  constructor(private _categoryRepository: CategoryRepository) {
    super();
  }

  async updateProfile(userId: string, profile: SellerProfile): Promise<void> {
    this._logger.info(`Updating profile of seller with id: ${userId}`);

    const profileKeys =
      "name, description, phoneNumber, address, businessEmail, logoUrl, websiteUrl".split(
        ", "
      );

    Object.keys(profile).forEach((key) => {
      if (!profileKeys.includes(key)) delete profile[key];
    });

    await this.updateUser({
      _id: userId,
      profile,
    } as User);
  }

  async updateCategory(userId: string, categoryId: string): Promise<void> {
    this._logger.info(`Updating category of seller with id: ${userId}`);

    const { profile } = Context.getUser();

    await this.updateUser({
      _id: userId,
      profile: { ...profile, categoryId },
    } as User);
  }

  async assignItemCategory(
    userId: string,
    categoryId: string,
    profile: SellerProfile
  ): Promise<void> {
    this._logger.info(`Assigning item category to seller with id: ${userId}`);

    const categories = profile.itemCategories ?? [];

    if (categories.includes(categoryId)) {
      throwError(
        `Category with id ${categoryId} already exists in the item categories`,
        400
      );
    }

    categories.push(categoryId);

    await this.updateUser({
      _id: userId,
      profile: { ...profile, itemCategories: categories },
    } as User);
  }

  async removeItemCategory(
    userId: string,
    categoryId: string,
    profile: SellerProfile
  ): Promise<void> {
    this._logger.info(`Removing item category from seller with id: ${userId}`);

    const categories = (profile as SellerProfile).itemCategories ?? [];

    if (!categories.includes(categoryId)) {
      throwError(
        `Category with id ${categoryId} does not exist in the item categories`,
        400
      );
    }

    const categoryIndex = categories.indexOf(categoryId);
    categories.splice(categoryIndex, 1);

    await this.updateUser({
      _id: userId,
      profile: { ...profile, itemCategories: categories },
    } as User);
  }

  async getItemCategories(userId: string): Promise<CategoryInfo[]> {
    this._logger.info(`Getting item categories of seller with id: ${userId}`);

    const user = await this.getUserById<User>(userId);
    const categories = (user.profile as SellerProfile).itemCategories ?? [];

    return await Promise.all(
      categories.map(async (categoryId) => {
        const category = {
          id: categoryId,
          ...(await this._categoryRepository.getOneCategory<CategoryInfo>(
            categoryId,
            "name description"
          )),
        };
        delete category["_id"];
        return category;
      })
    );
  }

  async getListOfSellers(): Promise<SellerInfo[]> {
    this._logger.info(`Getting list of sellers`);

    const sellers = await this.getListOfUsers<User>({
      conditions: { role: UserRole.SELLER, verified: true },
      projection: "profile.name profile.description profile.logoUrl",
    });

    return sellers.map((seller) => {
      const profile = seller.profile as SellerProfile;
      return {
        id: (seller._id as string).toString(),
        name: profile.name,
        description: profile.description,
        logoUrl: profile.logoUrl,
      };
    });
  }

  async getSeller(userId: string): Promise<{ profile: SellerProfile }> {
    this._logger.info(`Getting profile of seller with id: ${userId}`);

    return (await this.getUserById<User>(userId, "profile")) as {
      profile: SellerProfile;
    };
  }
}
