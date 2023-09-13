import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  isStrongPassword,
} from "class-validator";
import { UserRole } from "../../models";

export class LoginRequest {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class SignupRequest {
  @IsString()
  @IsEmail({}, { message: "Invalid email address" })
  email: string;

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

  @IsString()
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  sellerName?: string;
}

export class PasswordResetRequest {
  @IsString()
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
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
