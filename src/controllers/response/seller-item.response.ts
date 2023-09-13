import { SellerItem } from "../../models";

export class SellerItemResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // should be replaced by category object
  seller: string; // should be replaced by seller object
  isAvailable: boolean;
  quantity: number;
  imageUrl?: string;
  createdAt?: number;
  createdBy?: string;
  updatedAt?: number;
  updatedBy?: string;

  public static getItemResponse(item: SellerItem): SellerItemResponse {
    return {
      id: (item._id as string).toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.categoryId,
      seller: item.sellerId,
      isAvailable: item.isAvailable,
      quantity: item.quantity === Infinity ? -1 : item.quantity,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      createdBy: item.createdBy,
      updatedAt: item.updatedAt,
      updatedBy: item.updatedBy,
    };
  }

  public static getListOfItemsResponse(
    items: SellerItem[]
  ): SellerItemResponse[] {
    return items.map((item) => this.getItemResponse(item));
  }
}
