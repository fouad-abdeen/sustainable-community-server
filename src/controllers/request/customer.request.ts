import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class ProfileUpdateRequest {
  @IsOptional()
  @MinLength(2, { message: "First name cannot be shorter than 2 characters" })
  @MaxLength(50, { message: "First name cannot be longer than 50 characters" })
  @IsString({ message: "Invalid first name" })
  firstName?: string;

  @IsOptional()
  @MinLength(2, { message: "Last name cannot be shorter than 2 characters" })
  @MaxLength(50, { message: "Last name cannot be longer than 50 characters" })
  @IsString({ message: "Invalid last name" })
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber("LB", { message: "Invalid phone number" })
  phoneNumber?: string;

  @IsOptional()
  @MinLength(30, { message: "Address cannot be shorter than 30 characters" })
  @MaxLength(300, { message: "Address cannot be longer than 300 characters" })
  @IsString({ message: "Invalid address" })
  address?: string;
}
