import { Service } from "typedi";
import { UserRepository } from "./user.repository";
import { ISellerRepository } from "./interfaces";
import { SellerProfile, User } from "../models";
import { Context } from "../core";

@Service()
export class SellerRepository
  extends UserRepository
  implements ISellerRepository
{
  constructor() {
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
      throw new Error(
        `Category with id ${categoryId} already exists in the item categories`
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
      throw new Error(
        `Category with id ${categoryId} does not exist in the item categories`
      );
    }

    const categoryIndex = categories.indexOf(categoryId);
    categories.splice(categoryIndex, 1);

    await this.updateUser({
      _id: userId,
      profile: { ...profile, itemCategories: categories },
    } as User);
  }
}
