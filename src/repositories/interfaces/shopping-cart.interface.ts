import { CartItem, ShoppingCart } from "../../models";

export interface IShoppingCartRepository {
  /**
   * Gets the shopping cart for a customer
   * @param ownerId id of the customer
   */
  getCart(ownerId: string): Promise<ShoppingCart>;

  /**
   * Creates a shopping cart for a customer
   * @param ownerId id of the customer
   */
  createCart(ownerId: string): Promise<ShoppingCart>;

  /**
   * Updates the shopping cart for a customer
   * @param cart shopping cart to update
   * @param validateItems whether to validate items in the cart
   */
  updateCart(
    cart: ShoppingCart,
    validateItems?: boolean
  ): Promise<ShoppingCart>;

  /**
   * Clears the shopping cart for a customer
   * @param ownerId id of the customer
   */
  clearCart(ownerId: string): Promise<void>;

  /**
   * Adds an item to the shopping cart for a customer
   * @param ownerId id of the customer
   * @param item item to add
   */
  addItem(ownerId: string, item: CartItem): Promise<void>;

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
