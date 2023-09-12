import { Service } from "typedi";
import { ICustomerRepository } from "./interfaces";
import { UserRepository } from "./user.repository";
import { CustomerProfile, User } from "../models";

@Service()
export class CustomerRepository
  extends UserRepository
  implements ICustomerRepository
{
  constructor() {
    super();
  }

  async addItemToWhishlist(userId: string, itemId: string): Promise<void> {
    this._logger.info(
      `Adding item with id: ${itemId} to whishlist of user with id: ${userId}`
    );

    const user = await this.getUserById(userId);
    const whishlist = (user.profile as CustomerProfile).whishlist ?? [];

    if (whishlist.includes(itemId)) {
      throw new Error(`Item with id ${itemId} already exists in the whishlist`);
    }

    whishlist.push(itemId);

    await this.updateUser({
      _id: userId,
      profile: { ...user.profile, whishlist } as CustomerProfile,
    } as User);
  }

  async removeItemFromWhishlist(userId: string, itemId: string): Promise<void> {
    this._logger.info(
      `Removing item with id: ${itemId} from whishlist of user with id: ${userId}`
    );

    const user = await this.getUserById(userId);
    const whishlist = (user.profile as CustomerProfile).whishlist ?? [];

    if (!whishlist.includes(itemId)) {
      throw new Error(`Item with id ${itemId} does not exist in the whishlist`);
    }

    const itemIndex = whishlist.indexOf(itemId);
    whishlist.splice(itemIndex, 1);

    await this.updateUser({
      _id: userId,
      profile: { ...user.profile, whishlist } as CustomerProfile,
    } as User);
  }
}
