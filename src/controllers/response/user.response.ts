import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
} from "class-validator";
import { CustomerProfile, SellerProfile, User, UserRole } from "../../models";

export class UserResponse {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  verified: boolean;

  @IsObject()
  profile: CustomerProfile | SellerProfile;

  @IsNumber()
  createdAt?: number;

  @IsString()
  createdBy?: string;

  @IsNumber()
  updatedAt?: number;

  @IsString()
  updatedBy?: string;

  public static getUserResponse(user: User): UserResponse {
    return {
      id: (user._id as string).toString(),
      email: user.email,
      role: user.role,
      verified: user.verified,
      profile: user.profile,
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
    };
  }
}
