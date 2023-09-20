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
import { BaseService } from "../core";
import { Service } from "typedi";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { SellerItemResponse } from "./response/seller-item.response";
import {
  SellerItemCreationRequest,
  SellerItemQuery,
  SellerItemUpdateRequest,
} from "./request/seller-item.request";
import { SellerItem, UserRole } from "../models";
import { SellerItemService } from "../services";

@JsonController("/items")
@Service()
export class SellerItemController extends BaseService {
  constructor(private _sellerItemService: SellerItemService) {
    super(__filename);
  }

  // #region Get List of Items
  @Get("/")
  @OpenAPI({
    summary: "Get list of items",
  })
  @ResponseSchema(SellerItemResponse, { isArray: true })
  async getListOfItems(
    @QueryParams() conditions: SellerItemQuery
  ): Promise<SellerItemResponse[]> {
    this._logger.info(
      `Received a request to get list of items with the properties: ${JSON.stringify(
        conditions,
        null,
        2
      )}`
    );

    const items = await this._sellerItemService.getListOfItems(conditions);

    return SellerItemResponse.getListOfItemsResponse(items);
  }
  // #endregion

  // #region Get Item
  @Get("/:id")
  @OpenAPI({
    summary: "Get item by id",
  })
  @ResponseSchema(SellerItemResponse)
  async getItem(@Param("id") id: string): Promise<SellerItemResponse> {
    this._logger.info(`Received a request to get item with id: ${id}`);

    const item = await this._sellerItemService.getItem(id);

    return SellerItemResponse.getItemResponse(item);
  }
  // #endregion

  // #region Create Item
  @Authorized({
    roles: [UserRole.SELLER],
    disclaimer: "Only sellers can create an item",
  })
  @HeaderParam("auth", { required: true })
  @Post("/")
  @OpenAPI({
    summary: "Create an item",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(SellerItemResponse)
  async createItem(
    @Body() item: SellerItemCreationRequest
  ): Promise<SellerItemResponse> {
    this._logger.info(`Received a request to create an item`);

    const createdItem = await this._sellerItemService.createItem(
      item as SellerItem
    );

    return SellerItemResponse.getItemResponse(createdItem);
  }
  // #endregion

  // #region Update Item
  @Authorized({
    roles: [UserRole.SELLER, UserRole.ADMIN],
    disclaimer: "Only sellers and admins can update an item",
  })
  @HeaderParam("auth", { required: true })
  @Put("/:id")
  @OpenAPI({
    summary: "Update an item",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(SellerItemResponse)
  async updateItem(
    @Param("id") id: string,
    @Body() item: SellerItemUpdateRequest
  ): Promise<SellerItemResponse> {
    this._logger.info(`Received a request to update an item with id: ${id}`);

    const updatedItem = await this._sellerItemService.updateItem({
      _id: id,
      ...item,
    } as SellerItem);

    return SellerItemResponse.getItemResponse(updatedItem);
  }
  // #endregion

  // #region Delete Item
  @Authorized({
    roles: [UserRole.SELLER],
    disclaimer: "Only sellers can delete an item",
  })
  @HeaderParam("auth", { required: true })
  @Delete("/:id")
  @OpenAPI({
    summary: "Delete an item",
    security: [{ bearerAuth: [] }],
  })
  async deleteItem(@Param("id") id: string): Promise<void> {
    this._logger.info(`Received a request to delete an item with id: ${id}`);

    await this._sellerItemService.deleteItem(id);
  }
  // #endregion
}
