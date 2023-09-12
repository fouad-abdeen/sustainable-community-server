import { SellerItemRequest } from "../../controllers/request/seller-item.request";
import { SellerItem } from "../../models";

export interface ISellerItemRepository {
  /**
   * Gets one item by id
   * @param id id of the item
   */
  getOneItem(id: string): Promise<SellerItem>;

  /**
   * Gets a list of items
   * @param conditons conditions to filter items
   */
  getListOfItems(conditions: SellerItemRequest): Promise<SellerItem[]>;
}
