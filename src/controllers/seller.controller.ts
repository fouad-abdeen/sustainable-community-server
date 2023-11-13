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
  QueryParams,
} from "routing-controllers";
import { BaseService, Context, throwError } from "../core";
import { Service } from "typedi";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { isMongoId } from "class-validator";
import { ProfileUpdateRequest } from "./request/seller.request";
import { CategoryRepository, SellerRepository } from "../repositories";
import {
  Category,
  CategoryInfo,
  CategoryType,
  SellerInfo,
  SellerProfile,
  User,
  UserRole,
} from "../models";
import { SellerService } from "../services";
import { SellersQueryParams } from "./request/seller.request";

@JsonController("/sellers")
@Service()
export class SellerController extends BaseService {
  constructor(
    private _sellerService: SellerService,
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
  @HeaderParam("auth")
  @Put("/profile")
  @OpenAPI({
    summary: "Update seller profile",
    security: [{ bearerAuth: [] }],
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
  @HeaderParam("auth")
  @Put("/:id/categories/:categoryId")
  @OpenAPI({
    summary: "Update seller category",
    security: [{ bearerAuth: [] }],
  })
  async updateCategory(
    @Param("id") id: string,
    @Param("categoryId") categoryId: string
  ): Promise<void> {
    this._logger.info(
      `Received a request to update category of seller with id: ${id}`
    );

    if (!isMongoId(id)) throwError("Invalid or missing seller's id", 400);
    if (!isMongoId(categoryId))
      throwError("Invalid or missing category's id", 400);

    const user = await this._sellerRepository.getUser<User>({
      conditions: { _id: id },
    });
    if (user.role !== UserRole.SELLER)
      throwError(`User with id ${id} is not a seller`, 400);

    const category = await this._categoryRepository.getOneCategory<Category>(
      categoryId
    );
    if (
      // category.type !== CategoryType.PRODUCT &&
      category.type !== CategoryType.SERVICE
    )
      throwError("Invalid category type", 400);

    await this._sellerRepository.updateCategory(
      id,
      categoryId,
      user.profile as SellerProfile
    );
  }
  // #endregion

  // #region Assign Item Category
  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can assign an item category to a seller",
  })
  @HeaderParam("auth")
  @Post("/:id/item-categories/:categoryId")
  @OpenAPI({
    summary: "Assign item category to seller",
    security: [{ bearerAuth: [] }],
  })
  async assignItemCategory(
    @Param("id") id: string,
    @Param("categoryId") categoryId: string
  ): Promise<void> {
    this._logger.info(
      `Received a request to assign item category to seller with id: ${id}`
    );

    if (!isMongoId(id)) throwError("Invalid or missing seller's id", 400);
    if (!isMongoId(categoryId))
      throwError("Invalid or missing category's id", 400);

    const user = await this._sellerRepository.getUser<User>({
      conditions: { _id: id },
    });
    if (user.role !== UserRole.SELLER)
      throwError(`User with id ${id} is not a seller`, 400);

    const category = await this._categoryRepository.getOneCategory<Category>(
      categoryId
    );
    if (category.type !== CategoryType.ITEM)
      throwError("Invalid category type", 400);

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
  @HeaderParam("auth")
  @Delete("/:id/item-categories/:categoryId")
  @OpenAPI({
    summary: "Remove item category from seller",
    security: [{ bearerAuth: [] }],
  })
  async removeItemCategory(
    @Param("id") id: string,
    @Param("categoryId") categoryId: string
  ): Promise<void> {
    this._logger.info(
      `Received a request to remove item category from seller with id: ${id}`
    );

    if (!isMongoId(id)) throwError("Invalid or missing seller's id", 400);
    if (!isMongoId(categoryId))
      throwError("Invalid or missing category's id", 400);

    const user = await this._sellerRepository.getUser<User>({
      conditions: { _id: id },
    });
    if (user.role !== UserRole.SELLER)
      throwError(`User with id ${id} is not a seller`, 400);

    await this._sellerService.removeItemCategory(id, categoryId);
  }
  // #endregion

  // #region Get Item Categories
  @Get("/:id/item-categories")
  @OpenAPI({
    summary: "Get seller's item categories",
  })
  async getItemCategories(@Param("id") id: string): Promise<CategoryInfo[]> {
    this._logger.info(
      `Received a request to get item categories of seller with id: ${id}`
    );

    if (!isMongoId(id)) throwError("Invalid or missing seller's id", 400);

    const user = await this._sellerRepository.getUser<User>({
      conditions: { _id: id },
    });
    if (user.role !== UserRole.SELLER)
      throwError(`User with id ${id} is not a seller`, 400);

    const categories = (user.profile as SellerProfile).itemCategories ?? [];

    return await this._sellerRepository.getItemCategories(id, categories);
  }
  // #endregion

  // #region Get List Of Sellers
  @Get("/")
  @OpenAPI({
    summary: "Get list of sellers",
  })
  @ResponseSchema(SellerInfo, { isArray: true })
  async getListOfSellers(
    @QueryParams() params: SellersQueryParams
  ): Promise<SellerInfo[]> {
    this._logger.info(`Received a request to get list of sellers`);

    return await this._sellerRepository.getListOfSellers(
      "profile",
      params.activeSellers
    );
  }
  // #endregion

  // #region Get Seller
  @Get("/:id")
  @OpenAPI({
    summary: "Get seller by id",
  })
  @ResponseSchema(SellerInfo)
  async getSeller(@Param("id") id: string): Promise<SellerInfo> {
    this._logger.info(`Received a request to get seller with id: ${id}`);

    return await this._sellerRepository.getSeller(id);
  }
  // #endregion
}
