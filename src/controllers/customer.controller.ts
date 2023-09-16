import {
  Authorized,
  Body,
  Delete,
  JsonController,
  Post,
  Put,
  QueryParams,
} from "routing-controllers";
import { BaseService, Context } from "../core";
import { Service } from "typedi";
import { OpenAPI } from "routing-controllers-openapi";
import { CustomerRepository } from "../repositories";
import {
  ProfileUpdateRequest,
  WhishlistQueryParams,
} from "./request/customer.request";
import { CustomerProfile, UserRole } from "../models";

@JsonController("/customer")
@Service()
export class CustomerController extends BaseService {
  constructor(private _customerRepository: CustomerRepository) {
    super(__filename);
  }

  // #region Add Item to Whishlist
  @Authorized()
  @Post("/whishlist")
  @OpenAPI({
    summary: "Add item to customer's whishlist",
    responses: {
      "400": {
        description: "Failed to add item to whishlist",
      },
    },
  })
  async addItemTowhishlist(
    @QueryParams() { itemId }: WhishlistQueryParams
  ): Promise<void> {
    const { _id } = Context.getUser();
    this._logger.info(
      `Received a request to add item with id: ${itemId} to whishlist of customer with id: ${_id}`
    );
    await this._customerRepository.addItemToWhishlist(_id as string, itemId);
  }
  // #endregion

  // #region Remove Item from Whishlist
  @Authorized()
  @Delete("/whishlist")
  @OpenAPI({
    summary: "Remove item from customer's whishlist",
    responses: {
      "400": {
        description: "Failed to remove item from whishlist",
      },
    },
  })
  async removeItemFromwhishlist(
    @QueryParams() { itemId }: WhishlistQueryParams
  ): Promise<void> {
    const { _id } = Context.getUser();
    this._logger.info(
      `Received a request to remove item with id: ${itemId} from whishlist of customer with id: ${_id}`
    );
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
