import { Service } from "typedi";
import { BaseService, throwError } from "../core";
import { SellerItemRepository, SellerRepository } from "../repositories";
import { SellerProfile, User, UserRole } from "../models";

@Service()
export class SellerService extends BaseService {
  constructor(
    private _menuItemRepository: SellerItemRepository,
    private _sellerRepository: SellerRepository
  ) {
    super(__filename);
  }

  async removeItemCategory(
    sellerId: string,
    categoryId: string
  ): Promise<void> {
    this._logger.info(
      `Attempting to remove category with id: ${categoryId} from seller with id: ${sellerId}`
    );

    const user = await this._sellerRepository.getUserById<User>(sellerId);

    if (user.role !== UserRole.SELLER)
      throwError(`User with id ${sellerId} is not a seller`, 400);

    const items = await this._menuItemRepository.getListOfItems(
      {
        sellerId,
        categoryId,
      },
      "_id",
      true
    );

    if ((items ?? []).length > 0) {
      throwError("Cannot remove a category that is assigned to items", 400);
    }

    await this._sellerRepository.removeItemCategory(
      sellerId,
      categoryId,
      user.profile as SellerProfile
    );
  }
}
