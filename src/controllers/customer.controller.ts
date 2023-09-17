import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from "routing-controllers";
import { BaseService, Context } from "../core";
import { Service } from "typedi";
import { OpenAPI } from "routing-controllers-openapi";
import { isMongoId } from "class-validator";
import { CustomerRepository, SellerItemRepository } from "../repositories";
import { ProfileUpdateRequest } from "./request/customer.request";
import { CustomerProfile, UserRole } from "../models";
import { WishlistItem } from "../repositories/interfaces";

@JsonController("/customer")
@Service()
export class CustomerController extends BaseService {
  constructor(
    private _customerRepository: CustomerRepository,
    private _sellerItemRepository: SellerItemRepository
  ) {
    super(__filename);
  }

  // #region Add Item to Wishlist
  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "User must be a customer to add an item to their wishlist",
  })
  @Post("/wishlist/items/:itemId")
  @OpenAPI({
    summary: "Add item to customer's wishlist",
    responses: {
      "400": {
        description: "Failed to add item to wishlist",
      },
    },
  })
  async addItemToWishlist(@Param("itemId") itemId: string): Promise<void> {
    const { _id } = Context.getUser();

    this._logger.info(
      `Received a request to add item with id: ${itemId} to wishlist of customer with id: ${_id}`
    );

    if (!isMongoId(itemId)) throw new Error("Invalid or missing item's id");
    await this._sellerItemRepository.getItem(itemId);

    await this._customerRepository.addItemToWishlist(_id as string, itemId);
  }
  // #endregion

  // #region Remove Item from Wishlist
  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "User must be a customer to remove an item from their wishlist",
  })
  @Delete("/wishlist/items/:itemId")
  @OpenAPI({
    summary: "Remove item from customer's wishlist",
    responses: {
      "400": {
        description: "Failed to remove item from wishlist",
      },
    },
  })
  async removeItemFromWishlist(@Param("itemId") itemId: string): Promise<void> {
    const { _id } = Context.getUser();

    this._logger.info(
      `Received a request to remove item with id: ${itemId} from wishlist of customer with id: ${_id}`
    );

    if (!isMongoId(itemId)) throw new Error("Invalid or missing item's id");
    await this._sellerItemRepository.getItem(itemId);

    await this._customerRepository.removeItemFromWishlist(
      _id as string,
      itemId
    );
  }
  // #endregion

  // #region Get Wishlist Items
  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "User must be a customer to get their wishlist items",
  })
  @Get("/wishlist/items")
  @OpenAPI({
    summary: "Get customer's wishlist items",
    responses: {
      "404": {
        description: "Wishlist items not found",
      },
    },
  })
  async getWishlistItems(): Promise<WishlistItem[]> {
    const { _id } = Context.getUser();

    this._logger.info(
      `Received a request to get wishlist items of customer with id: ${_id}`
    );

    return await this._customerRepository.getWishlistItems(_id as string);
  }

  // #region Update Profile
  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "User must be a customer to update their profile",
  })
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
    const { _id, profile: currentProfile } = Context.getUser();

    this._logger.info(
      `Received a request to update profile of customer with id: ${_id}`
    );

    await this._customerRepository.updateProfile(_id as string, {
      ...(currentProfile as CustomerProfile),
      ...profile,
    });
  }
  // #endregion
}
