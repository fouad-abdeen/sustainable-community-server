import {
  Authorized,
  Body,
  Delete,
  JsonController,
  Param,
  Post,
  Put,
} from "routing-controllers";
import { BaseService, Context } from "../core";
import { Service } from "typedi";
import { OpenAPI } from "routing-controllers-openapi";
import { isMongoId } from "class-validator";
import { ProfileUpdateRequest } from "./request/seller.request";
import { CategoryRepository, SellerRepository } from "../repositories";
import { CategoryType, SellerProfile, UserRole } from "../models";

@JsonController("/seller")
@Service()
export class SellerController extends BaseService {
  constructor(
    private _sellerRepository: SellerRepository,
    private _categoryRepository: CategoryRepository
  ) {
    super(__filename);
  }

  // #region Update Profile
  @Authorized({
    roles: [UserRole.SELLER],
    disclaimer: "User must be a seller to update their profile",
  })
  @Put("/profile")
  @OpenAPI({
    summary: "Update seller profile",
    responses: {
      "400": {
        description: "Failed to update seller profile",
      },
    },
  })
  async updateProfile(@Body() profile: ProfileUpdateRequest): Promise<void> {
    const { _id, profile: currentProfile } = Context.getUser();

    this._logger.info(
      `Received a request to update profile of seller with id: ${_id}`
    );

    await this._sellerRepository.updateProfile(_id as string, {
      ...(currentProfile as SellerProfile),
      ...profile,
    });
  }
  // #endregion

  // #region Update Category
  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can update a seller's category",
  })
  @Put("/:id/category/:categoryId")
  @OpenAPI({
    summary: "Update seller category",
    responses: {
      "400": {
        description: "Failed to update seller category",
      },
    },
  })
  async updateCategory(
    @Param("id") id: string,
    @Param("categoryId") categoryId: string
  ): Promise<void> {
    this._logger.info(
      `Received a request to update category of seller with id: ${id}`
    );

    if (!isMongoId(id)) throw new Error("Invalid or missing seller's id");
    if (!isMongoId(categoryId))
      throw new Error("Invalid or missing category's id");

    const user = await this._sellerRepository.getUserById(id);
    if (user.role !== UserRole.SELLER)
      throw new Error(`User with id ${id} is not a seller`);

    const category = await this._categoryRepository.getOneCategory(categoryId);
    if (
      category.type !== CategoryType.PRODUCT &&
      category.type !== CategoryType.SERVICE
    )
      throw new Error("Invalid category type");

    await this._sellerRepository.updateCategory(id, categoryId);
  }
  // #endregion

  // #region Assign Item Category
  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can assign an item category to a seller",
  })
  @Post("/:id/item-categories/:categoryId")
  @OpenAPI({
    summary: "Assign item category to seller",
    responses: {
      "400": {
        description: "Failed to assign item category to seller",
      },
    },
  })
  async assignItemCategory(
    @Param("id") id: string,
    @Param("categoryId") categoryId: string
  ): Promise<void> {
    this._logger.info(
      `Received a request to assign item category to seller with id: ${id}`
    );

    if (!isMongoId(id)) throw new Error("Invalid or missing seller's id");
    if (!isMongoId(categoryId))
      throw new Error("Invalid or missing category's id");

    const user = await this._sellerRepository.getUserById(id);
    if (user.role !== UserRole.SELLER)
      throw new Error(`User with id ${id} is not a seller`);

    const category = await this._categoryRepository.getOneCategory(categoryId);
    if (category.type !== CategoryType.ITEM)
      throw new Error("Invalid category type");

    await this._sellerRepository.assignItemCategory(
      id,
      categoryId,
      user.profile as SellerProfile
    );
  }
  // #endregion

  // #region Remove Item Category
  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can remove an item category from a seller",
  })
  @Delete("/:id/item-categories/:categoryId")
  @OpenAPI({
    summary: "Remove item category from seller",
    responses: {
      "400": {
        description: "Failed to remove item category from seller",
      },
    },
  })
  async removeItemCategory(
    @Param("id") id: string,
    @Param("categoryId") categoryId: string
  ): Promise<void> {
    this._logger.info(
      `Received a request to remove item category from seller with id: ${id}`
    );

    if (!isMongoId(id)) throw new Error("Invalid or missing seller's id");
    if (!isMongoId(categoryId))
      throw new Error("Invalid or missing category's id");

    const user = await this._sellerRepository.getUserById(id);
    if (user.role !== UserRole.SELLER)
      throw new Error(`User with id ${id} is not a seller`);

    await this._sellerRepository.removeItemCategory(
      id,
      categoryId,
      user.profile as SellerProfile
    );
  }
  // #endregion
}
