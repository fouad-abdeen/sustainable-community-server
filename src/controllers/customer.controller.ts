import {
  Authorized,
  Body,
  Delete,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  Put,
} from "routing-controllers";
import { BaseService, Context, throwError } from "../core";
import { Service } from "typedi";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { isMongoId } from "class-validator";
import { CustomerRepository, SellerItemRepository } from "../repositories";
import { ProfileUpdateRequest } from "./request";
import { CustomerProfile, UserRole, WishlistItem } from "../models";

@JsonController("/customers")
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
  @HeaderParam("auth", { required: true })
  @Post("/wishlist/items/:itemId")
  @OpenAPI({
    summary: "Add item to customer's wishlist",
    security: [{ bearerAuth: [] }],
  })
  async addItemToWishlist(@Param("itemId") itemId: string): Promise<void> {
    const { _id } = Context.getUser();

    this._logger.info(
      `Received a request to add item with id: ${itemId} to wishlist of customer with id: ${_id}`
    );

    if (!isMongoId(itemId)) throwError("Invalid or missing item's id", 400);
    await this._sellerItemRepository.getItem(itemId);

    await this._customerRepository.addItemToWishlist(_id as string, itemId);
  }
  // #endregion

  // #region Remove Item from Wishlist
  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "User must be a customer to remove an item from their wishlist",
  })
  @HeaderParam("auth", { required: true })
  @Delete("/wishlist/items/:itemId")
  @OpenAPI({
    summary: "Remove item from customer's wishlist",
    security: [{ bearerAuth: [] }],
  })
  async removeItemFromWishlist(@Param("itemId") itemId: string): Promise<void> {
    const { _id } = Context.getUser();

    this._logger.info(
      `Received a request to remove item with id: ${itemId} from wishlist of customer with id: ${_id}`
    );

    if (!isMongoId(itemId)) throwError("Invalid or missing item's id", 400);
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
  @HeaderParam("auth", { required: true })
  @Get("/wishlist/items")
  @OpenAPI({
    summary: "Get customer's wishlist items",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(WishlistItem, { isArray: true })
  async getWishlistItems(): Promise<WishlistItem[]> {
    const { _id } = Context.getUser();

    this._logger.info(
      `Received a request to get wishlist items of customer with id: ${_id}`
    );

    return await this._customerRepository.getWishlistItems(_id as string);
  }
  // #endregion

  // #region Update Profile
  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "User must be a customer to update their profile",
  })
  @HeaderParam("auth", { required: true })
  @Put("/profile")
  @OpenAPI({
    summary: "Update customer's profile",
    security: [{ bearerAuth: [] }],
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
