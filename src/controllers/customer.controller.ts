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
import { CustomerRepository, SellerItemRepository } from "../repositories";
import { ProfileUpdateRequest } from "./request/customer.request";
import { CustomerProfile, UserRole } from "../models";
import { isMongoId } from "class-validator";

@JsonController("/customer")
@Service()
export class CustomerController extends BaseService {
  constructor(
    private _customerRepository: CustomerRepository,
    private _sellerItemRepository: SellerItemRepository
  ) {
    super(__filename);
  }

  // #region Add Item to Whishlist
  @Authorized()
  @Post("/whishlist/items/:itemId")
  @OpenAPI({
    summary: "Add item to customer's whishlist",
    responses: {
      "400": {
        description: "Failed to add item to whishlist",
      },
    },
  })
  async addItemTowhishlist(@Param("itemId") itemId: string): Promise<void> {
    const { _id, role } = Context.getUser();
    this._logger.info(
      `Received a request to add item with id: ${itemId} to whishlist of customer with id: ${_id}`
    );

    if (role !== UserRole.CUSTOMER)
      throw new Error(`User with id ${_id} is not a customer`);

    if (!isMongoId(itemId)) throw new Error("Invalid or missing item's id");
    await this._sellerItemRepository.getItem(itemId);

    await this._customerRepository.addItemToWhishlist(_id as string, itemId);
  }
  // #endregion

  // #region Remove Item from Whishlist
  @Authorized()
  @Delete("/whishlist/items/:itemId")
  @OpenAPI({
    summary: "Remove item from customer's whishlist",
    responses: {
      "400": {
        description: "Failed to remove item from whishlist",
      },
    },
  })
  async removeItemFromwhishlist(
    @Param("itemId") itemId: string
  ): Promise<void> {
    const { _id, role } = Context.getUser();
    this._logger.info(
      `Received a request to remove item with id: ${itemId} from whishlist of customer with id: ${_id}`
    );

    if (role !== UserRole.CUSTOMER)
      throw new Error(`User with id ${_id} is not a customer`);

    if (!isMongoId(itemId)) throw new Error("Invalid or missing item's id");
    await this._sellerItemRepository.getItem(itemId);

    await this._customerRepository.removeItemFromWhishlist(
      _id as string,
      itemId
    );
  }
  // #endregion

  // #region Update Profile
  @Authorized()
  @Put("/profile")
  @OpenAPI({
    summary: "Update customer's profile",
    responses: {
      "400": {
        description: "Failed to update profile",
      },
    },
  })
  async updateProfile(@Body() profile: ProfileUpdateRequest): Promise<void> {
    const { _id, role, profile: currentProfile } = Context.getUser();
    this._logger.info(
      `Received a request to update profile of customer with id: ${_id}`
    );

    if (role !== UserRole.CUSTOMER)
      throw new Error(`User with id ${_id} is not a customer`);

    await this._customerRepository.updateProfile(_id as string, {
      ...(currentProfile as CustomerProfile),
      ...profile,
    });
  }
  // #endregion
}
