import { IsInstance } from "class-validator";
import { Tokens, UserInfo } from "../../models";

export class AuthResponse {
  @IsInstance(UserInfo)
  userInfo: UserInfo;

  @IsInstance(Tokens)
  tokens: Tokens;
}
