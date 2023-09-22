import { CartItem } from "../../models";
import { ShoppingCart } from "../../models/shopping-cart.model";

export interface IShoppingCartRepository {
  /**
   * Gets the shopping cart for a customer
   * @param ownerId id of the customer
   */
  getCart(ownerId: string): Promise<ShoppingCart>;

  /**
   * Clears the shopping cart for a customer
   * @param ownerId id of the customer
   */
  clearCart(ownerId: string): Promise<void>;

  /**
   * Adds an item to the shopping cart for a customer
   * @param ownerId id of the customer
   * @param item item to add
   * @param stock available stock of the item
   */
  addItem(ownerId: string, item: CartItem, stock: number): Promise<void>;

  /**
   * Removes an item from the shopping cart for a customer
   * @param ownerId id of the customer
   * @param itemId id of the item to remove
   */
  removeItem(ownerId: string, itemId: string): Promise<void>;

  /**
   * Update an item in the shopping cart for a customer
   * @param ownerId id of the customer
   * @param item item to update
   */
  updateItem(ownerId: string, item: CartItem): Promise<void>;
}
