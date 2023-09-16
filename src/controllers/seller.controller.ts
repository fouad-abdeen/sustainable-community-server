import {
  Authorized,
  Body,
  JsonController,
  Param,
  Put,
} from "routing-controllers";
import { BaseService, Context } from "../core";
import { Service } from "typedi";
import { OpenAPI } from "routing-controllers-openapi";
import { ProfileUpdateRequest } from "./request/seller.request";
import { CategoryRepository, SellerRepository } from "../repositories";
import { CategoryType, SellerProfile, UserRole } from "../models";
import { isMongoId } from "class-validator";

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
  @Authorized()
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
    const { _id, role, profile: currentProfile } = Context.getUser();
    this._logger.info(
      `Received a request to update profile of seller with id: ${_id}`
    );

    if (role !== UserRole.SELLER)
      throw new Error(`User with id ${_id} is not a seller`);

    await this._sellerRepository.updateProfile(_id as string, {
      ...(currentProfile as SellerProfile),
      ...profile,
    });
  }
  // #endregion

  @Authorized()
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

    if (Context.getUser().role !== UserRole.ADMIN)
      throw new Error(`Unauthorized to update a seller's category`);

    if (!isMongoId(id)) throw new Error("Invalid or missing seller's id");
    if (!isMongoId(categoryId))
      throw new Error("Invalid or missing category's id");

    const category = await this._categoryRepository.getOneCategory(categoryId);
    if (
      category.type !== CategoryType.PRODUCT &&
      category.type !== CategoryType.SERVICE
    )
      throw new Error("Invalid category type");

    await this._sellerRepository.updateCategory(id, categoryId);
  }
}
