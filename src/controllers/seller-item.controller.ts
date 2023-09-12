import { Get, JsonController, Param, QueryParams } from "routing-controllers";
import { BaseService } from "../core";
import { Service } from "typedi";
import { SellerItemRepository } from "../repositories";
import { OpenAPI } from "routing-controllers-openapi";
import { SellerItemResponse } from "./response/seller-item.response";
import { SellerItemRequest } from "./request/seller-item.request";

@JsonController()
@Service()
export class SellerItemController extends BaseService {
  constructor(private _sellerItemRepository: SellerItemRepository) {
    super(__filename);
  }

  // #region Logout
  @Get("/items/:id")
  @OpenAPI({
    summary: "Get item by id",
    responses: {
      "404": {
        description: "Item not found",
      },
    },
  })
  async getOneItem(@Param("id") id: string): Promise<SellerItemResponse> {
    this._logger.info(`Received a request to get item with id: ${id}`);
    const item = await this._sellerItemRepository.getOneItem(id);
    return SellerItemResponse.getItemResponse(item);
  }

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
    @QueryParams() conditions: SellerItemRequest
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
}
