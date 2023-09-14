import {
  IsEmail,
  IsEnum,
  IsJWT,
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

  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Invalid name's value" })
  @IsOptional()
  sellerName?: string;
}

export class PasswordResetRequest {
  @IsJWT({ message: "Invalid or missing token" })
  token: string;

  @IsString()
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
  password: string;
}

export class RefreshTokenRequest {
  @IsJWT({ message: "Invalid or missing access token" })
  accessToken: string;

  @IsJWT({ message: "Invalid or missing refresh token" })
  refreshToken: string;
}
