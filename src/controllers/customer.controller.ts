import {
  Authorized,
  Delete,
  JsonController,
  Post,
  QueryParams,
} from "routing-controllers";
import { BaseService, Context } from "../core";
import { Service } from "typedi";
import { OpenAPI } from "routing-controllers-openapi";
import { CustomerRepository } from "../repositories";
import { WhishlistQueryParams } from "./request/customer.request";

@JsonController()
@Service()
export class CustomerController extends BaseService {
  constructor(private _customerRepository: CustomerRepository) {
    super(__filename);
  }

  // #region Add an item to whishlist
  @Authorized()
  @Post("/customer/whishlist")
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
    this._logger.info(
      `Received a request to add item with id: ${itemId} to whishlist`
    );

    const { _id } = Context.getUser();

    await this._customerRepository.addItemToWhishlist(_id as string, itemId);
  }
  // #endregion

  // #region Remove an item from whishlist
  @Authorized()
  @Delete("/customer/whishlist")
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
    this._logger.info(
      `Received a request to remove item with id: ${itemId} from whishlist`
    );

    const { _id } = Context.getUser();

    await this._customerRepository.removeItemFromWhishlist(
      _id as string,
      itemId
    );
  }
  // #endregion
}
