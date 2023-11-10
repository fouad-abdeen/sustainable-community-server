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
import { BaseService, Context, throwError } from "../core";
import { Service } from "typedi";
import { isMongoId } from "class-validator";
import { CustomerRepository, SellerItemRepository } from "../repositories";
import { ProfileUpdateRequest } from "./request/customer.request";
import { CustomerProfile, UserRole, WishlistItem } from "../models";

@JsonController("/customers")
@Service()
export class CustomerController extends BaseService {
  constructor(
    private _customerRepository: CustomerRepository,
    private _SellerItemRepository: SellerItemRepository
  ) {
    super(__filename);
  }

  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "User must be a customer to add an item to their wishlist",
  })
  @Post("/wishlist/items/:itemId")
  async addItemToWishlist(@Param("itemId") itemId: string): Promise<void> {
    const { _id } = Context.getUser();

    this._logger.info(
      `Received a request to add item with id: ${itemId} to wishlist of customer with id: ${_id}`
    );

    if (!isMongoId(itemId)) throwError("Invalid or missing item's id", 400);
    await this._SellerItemRepository.getItem(itemId);

    await this._customerRepository.addItemToWishlist(_id as string, itemId);
  }

  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "User must be a customer to remove an item from their wishlist",
  })
  @Delete("/wishlist/items/:itemId")
  async removeItemFromWishlist(@Param("itemId") itemId: string): Promise<void> {
    const { _id } = Context.getUser();

    this._logger.info(
      `Received a request to remove item with id: ${itemId} from wishlist of customer with id: ${_id}`
    );

    if (!isMongoId(itemId)) throwError("Invalid or missing item's id", 400);
    await this._SellerItemRepository.getItem(itemId);

    await this._customerRepository.removeItemFromWishlist(
      _id as string,
      itemId
    );
  }

  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "User must be a customer to get their wishlist items",
  })
  @Get("/wishlist/items")
  async getWishlistItems(): Promise<WishlistItem[]> {
    const { _id } = Context.getUser();

    this._logger.info(
      `Received a request to get wishlist items of customer with id: ${_id}`
    );

    return await this._customerRepository.getWishlistItems(_id as string);
  }

  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "User must be a customer to update their profile",
  })
  @Put("/profile")
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
}
