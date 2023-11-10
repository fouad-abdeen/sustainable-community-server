import { SellerItem } from "../../models";

export class SellerItemResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  sellerId: string;
  isAvailable: boolean;
  quantity: number;
  imageUrl?: string;
  createdAt?: number;
  updatedAt?: number;
  updatedBy?: string;

  public static getItemResponse(item: SellerItem): SellerItemResponse {
    return {
      id: (item._id as string).toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      sellerId: item.sellerId,
      isAvailable: item.isAvailable,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
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
