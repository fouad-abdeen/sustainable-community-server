import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

export class ProfileUpdateRequest {
  @IsOptional()
  @MinLength(2, { message: "Name cannot be shorter than 2 characters" })
  @MaxLength(50, { message: "Name cannot be longer than 50 characters" })
  @IsString({ message: "Invalid name" })
  name?: string;

  @IsOptional()
  @MinLength(100, {
    message: "Description cannot be shorter than 100 characters",
  })
  @MaxLength(500, {
    message: "Description cannot be longer than 500 characters",
  })
  @IsString({ message: "Invalid description" })
  description?: string;

  @IsOptional()
  @IsPhoneNumber("LB", { message: "Invalid phone number" })
  phoneNumber?: string;

  @IsOptional()
  @MinLength(30, { message: "Address cannot be shorter than 30 characters" })
  @MaxLength(300, { message: "Address cannot be longer than 300 characters" })
  @IsString({ message: "Invalid address" })
  address?: string;

  @IsOptional()
  @IsEmail({}, { message: "Invalid business email" })
  businessEmail?: string;

  @IsOptional()
  @IsUrl({}, { message: "Invalid logo url" })
  logoUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: "Invalid website url" })
  websiteUrl?: string;
}
