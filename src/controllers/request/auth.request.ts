import {
  IsEmail,
  IsEnum,
  IsJWT,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { UserRole } from "../../models";

export class LoginRequest {
  @IsEmail({}, { message: "Invalid or missing email address" })
  email: string;

  @IsNotEmpty({ message: "Password cannot be empty" })
  @IsString({ message: "Invalid or missing password" })
  password: string;
}

export class SignupRequest {
  @IsEmail({}, { message: "Invalid or missing email address" })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Weak password. Password should contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol",
    }
  )
  @IsString({ message: "Invalid or missing password" })
  password: string;

  @IsEnum(UserRole, { message: "Invalid or missing role" })
  role: UserRole;

  @IsNotEmpty({ message: "First name cannot be empty" })
  @IsString({ message: "Invalid value for first name" })
  @IsOptional()
  firstName?: string;

  @IsNotEmpty({ message: "Last name cannot be empty" })
  @IsString({ message: "Invalid value for last name" })
  @IsOptional()
  lastName?: string;

  @IsNotEmpty({ message: "The seller name cannot be empty" })
  @IsString({ message: "Invalid value for the seller name" })
  @IsOptional()
  sellerName?: string;

  @IsMongoId({ message: "Invalid seller's category id" })
  @IsOptional()
  categoryId?: string;
}

export class PasswordResetRequest {
  @IsJWT({ message: "Invalid or missing token" })
  token: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Weak password. Password should contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol",
    }
  )
  @IsString({ message: "Invalid or missing password" })
  password: string;
}

export class PasswordUpdateRequest {
  @IsNotEmpty({ message: "Current password cannot be empty" })
  @IsString({ message: "Current password is invalid or missing" })
  currentPassword: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "New password is weak. It should contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol",
    }
  )
  @IsString({ message: "New password is invalid or missing" })
  newPassword: string;
}

export class RefreshTokenRequest {
  @IsJWT({ message: "Invalid or missing access token" })
  accessToken: string;

  @IsJWT({ message: "Invalid or missing refresh token" })
  refreshToken: string;
}
