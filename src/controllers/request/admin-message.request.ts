import { IsString, MaxLength, MinLength } from "class-validator";

export class AdminMessageCreateRequest {
  @MinLength(2, { message: "Name cannot be shorter than 2 characters" })
  @MaxLength(50, { message: "Name cannot be longer than 50 characters" })
  @IsString({ message: "Invalid or missing name" })
  name: string;

  @IsString({ message: "Invalid or missing email" })
  email: string;

  @MinLength(50, { message: "Message cannot be shorter than 50 characters" })
  @MaxLength(1250, { message: "Message cannot be longer than 1250 characters" })
  @IsString({ message: "Invalid or missing message" })
  message: string;
}
