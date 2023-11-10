import Container, { Service } from "typedi";
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
    if (!this._categoryRepository)
      this._categoryRepository = Container.get(CategoryRepository);
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

    const { profile: currentProfile } = Context.getUser();

    await this.updateUser({
      _id: userId,
      profile: {
        ...currentProfile,
        ...profile,
      },
    } as User);
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    profile: SellerProfile
  ): Promise<void> {
    this._logger.info(`Updating category of seller with id: ${userId}`);

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

    let { itemCategories, ...sellerProfile } = profile as SellerProfile;

    if (!itemCategories) itemCategories = [];

    if (!itemCategories.includes(categoryId)) {
      throwError(
        `Category with id ${categoryId} does not exist in the item categories`,
        400
      );
    }

    const categoryIndex = itemCategories.indexOf(categoryId);
    itemCategories.splice(categoryIndex, 1);

    const updatedProfile =
      itemCategories.length > 0
        ? { ...sellerProfile, itemCategories }
        : sellerProfile;

    await this.updateUser({
      _id: userId,
      profile: updatedProfile,
    } as User);
  }

  async getItemCategories(
    userId: string,
    categories: string[]
  ): Promise<CategoryInfo[]> {
    this._logger.info(`Getting item categories of seller with id: ${userId}`);

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

  async getListOfSellers(
    projection: string,
    activeSellers = false
  ): Promise<SellerInfo[]> {
    this._logger.info(`Getting list sellers`);

    const conditions = { role: UserRole.SELLER };

    const sellers = await this.getListOfUsers({
      conditions: activeSellers
        ? { ...conditions, verified: true }
        : conditions,
      projection,
    });

    return sellers.map((seller) => {
      const { profile, _id } = seller;
      return {
        id: (_id as string).toString(),
        ...(profile ?? {}),
      };
    });
  }

  async getSeller(userId: string): Promise<SellerInfo> {
    this._logger.info(`Getting profile of seller with id: ${userId}`);

    const seller = (await this.getUserById<User>(userId, "profile")) as {
      profile: SellerProfile;
    };

    const category =
      await this._categoryRepository.getOneCategory<CategoryInfo>(
        seller.profile.categoryId,
        "name"
      );

    return {
      id: userId,
      ...seller.profile,
      categoryName: category.name,
    };
  }
}
