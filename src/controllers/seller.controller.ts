import { Authorized, Body, JsonController, Put } from "routing-controllers";
import { BaseService, Context } from "../core";
import { Service } from "typedi";
import { OpenAPI } from "routing-controllers-openapi";
import { ProfileUpdateRequest } from "./request/seller.request";
import { SellerRepository } from "../repositories";
import { SellerProfile, UserRole } from "../models";

@JsonController("/seller")
@Service()
export class SellerController extends BaseService {
  constructor(private _sellerRepository: SellerRepository) {
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
    console.log(_id);
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
}
