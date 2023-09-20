import { IsBoolean, IsInstance, IsNumber, IsString } from "class-validator";
import { CategoryInfo, ExtendedSellerItemData, ItemSeller } from "../../models";

export class SellerItemResponse {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsInstance(CategoryInfo)
  category: CategoryInfo;

  @IsInstance(ItemSeller)
  seller: ItemSeller;

  @IsBoolean()
  isAvailable: boolean;

  @IsNumber()
  quantity: number;

  @IsString()
  imageUrl?: string;

  @IsNumber()
  createdAt?: number;

  @IsString()
  createdBy?: string;

  @IsNumber()
  updatedAt?: number;

  @IsString()
  updatedBy?: string;

  public static getItemResponse(
    item: ExtendedSellerItemData
  ): SellerItemResponse {
    return {
      id: (item._id as string).toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      seller: item.seller,
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
    items: ExtendedSellerItemData[]
  ): SellerItemResponse[] {
    return items.map((item) => this.getItemResponse(item));
  }
}
