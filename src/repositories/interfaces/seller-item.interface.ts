import { SellerItemQuery } from "../../controllers/request/seller-item.request";
import { SellerItem } from "../../models";

export interface ISellerItemRepository {
  /**
   * Gets a list of items
   * @param conditons conditions to filter items
   */
  getListOfItems(conditions: SellerItemQuery): Promise<SellerItem[]>;

  /**
   * Gets one item by id
   * @param id id of the item
   * @param projection optional fields to return
   */
  getItem<S>(id: string, projection?: string): Promise<SellerItem | S>;

  /**
   * Creates a new item
   * @param item the item to be created
   */
  createItem(item: SellerItem): Promise<SellerItem>;

  /**
   * Updates an existing item
   * @param item the item to be updated
   */
  updateItem(item: SellerItem): Promise<SellerItem>;

  /**
   * Deletes an existing item
   * @param id id of the item to be deleted
   */
  deleteItem(id: string): Promise<void>;
}
