import { SellerItem } from "../../models";

export class SellerItemResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // should be replaced by category object
  seller: string; // should be replaced by seller object
  isAvailable: boolean;
  quantity?: number;
  imageUrl?: string;
  createdAt?: number;
  updatedAt?: number;

  public static getItemResponse(item: SellerItem): SellerItemResponse {
    return {
      id: item._id as string,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.categoryId,
      seller: item.sellerId,
      isAvailable: item.isAvailable,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  public static getListOfItemsResponse(
    items: SellerItem[]
  ): SellerItemResponse[] {
    return items.map((item) => this.getItemResponse(item));
  }
}
