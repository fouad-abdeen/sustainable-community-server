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
}
