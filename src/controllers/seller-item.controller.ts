import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParams,
} from "routing-controllers";
import { BaseService } from "../core";
import { Service } from "typedi";
import { SellerItemRepository } from "../repositories";
import { OpenAPI } from "routing-controllers-openapi";
import { SellerItemResponse } from "./response/seller-item.response";
import {
  SellerItemCreationRequest,
  SellerItemQuery,
  SellerItemUpdateRequest,
} from "./request/seller-item.request";
import { SellerItem } from "../models";
import { SellerItemService } from "../services";

@JsonController()
@Service()
export class SellerItemController extends BaseService {
  constructor(
    private _sellerItemService: SellerItemService,
    private _sellerItemRepository: SellerItemRepository
  ) {
    super(__filename);
  }

  // #region Get List of Items
  @Get("/items")
  @OpenAPI({
    summary: "Get list of items",
    responses: {
      "404": {
        description: "Items not found",
      },
    },
  })
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
    const items = await this._sellerItemRepository.getListOfItems(conditions);
    return SellerItemResponse.getListOfItemsResponse(items);
  }
  // #endregion

  // #region Get Item
  @Get("/items/:id")
  @OpenAPI({
    summary: "Get item by id",
    responses: {
      "404": {
        description: "Item not found",
      },
    },
  })
  async getItem(@Param("id") id: string): Promise<SellerItemResponse> {
    this._logger.info(`Received a request to get item with id: ${id}`);
    const item = await this._sellerItemRepository.getItem(id);
    return SellerItemResponse.getItemResponse(item);
  }
  // #endregion

  // #region Create Item
  @Authorized()
  @Post("/items")
  @OpenAPI({
    summary: "Create an item",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
  })
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
  @Authorized()
  @Put("/items/:id")
  @OpenAPI({
    summary: "Update an item",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
  })
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
  @Authorized()
  @Delete("/items/:id")
  @OpenAPI({
    summary: "Delete an item",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
  })
  async deleteItem(@Param("id") id: string): Promise<void> {
    this._logger.info(`Received a request to delete an item with id: ${id}`);
    await this._sellerItemService.deleteItem(id);
  }
  // #endregion
}
