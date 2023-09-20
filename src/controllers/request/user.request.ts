import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "../../models";

export class UserQuery {
  @IsOptional()
  @IsEnum(UserRole, { message: "Invalid role's value" })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: "Invalid value for is verified" })
  verified?: boolean;
}
