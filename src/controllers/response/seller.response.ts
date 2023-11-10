// import { IsInstance, IsString } from "class-validator";
// import { Category, CategoryInfo, SellerProfile } from "../../models";

// export class SellerResponse {
//   @IsString()
//   id: string;

//   @IsString()
//   name: string;

//   @IsString()
//   description: string;

//   @IsString()
//   phoneNumber: string;

//   @IsString()
//   address: string;

//   @IsString()
//   email: string;

//   @IsInstance(CategoryInfo)
//   category: CategoryInfo;

//   @IsString()
//   logoUrl?: string;

//   @IsString()
//   websiteUrl?: string;

//   public static getSellerResponse(
//     seller: SellerProfile & { _id?: string },
//     category: Category
//   ): SellerResponse {
//     return {
//       id: (seller._id as string).toString(),
//       name: seller.name,
//       description: seller.description,
//       phoneNumber: seller.phoneNumber,
//       address: seller.address,
//       email: seller.businessEmail,
//       category: {
//         id: (category._id as string).toString(),
//         name: category.name,
//         description: category.description,
//       },
//       logoUrl: seller.logoUrl,
//       websiteUrl: seller.websiteUrl,
//     };
//   }
// }
