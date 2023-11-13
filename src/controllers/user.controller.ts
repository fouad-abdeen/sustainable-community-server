import {
  Authorized,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Put,
} from "routing-controllers";
import { BaseService, throwError } from "../core";
import { Service } from "typedi";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { UserRepository } from "../repositories";
import { User, UserBriefInfo, UserRole } from "../models";
import { UserResponse } from "./response";
import { isMongoId } from "class-validator";

@JsonController("/users")
@Service()
export class UserController extends BaseService {
  constructor(private _userRepository: UserRepository) {
    super(__filename);
  }

  // #region Get List of Users
  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can get list of users",
  })
  @HeaderParam("auth")
  @Get("/")
  @OpenAPI({
    summary: "Get list of users",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(UserBriefInfo, { isArray: true })
  async getListOfUsers(): Promise<UserBriefInfo[]> {
    this._logger.info(`Received a request to get list of users`);

    return UserResponse.getListOfUsersResponse(
      await this._userRepository.getListOfUsers({})
    );
  }
  // #endregion

  // #region Acknowledge User Account
  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can acknowledge a user account",
  })
  @HeaderParam("auth")
  @Put("/:id/acknowledge")
  @OpenAPI({
    summary: "Acknowledge user account",
    security: [{ bearerAuth: [] }],
  })
  async acknowledgeUserAccount(@Param("id") id: string): Promise<void> {
    if (!isMongoId(id)) throwError("Invalid or missing user's id", 400);

    this._logger.info(`Acknowledging user account with id: ${id}`);

    await this._userRepository.updateUser({ _id: id, verified: true } as User);
  }
  // #endregion

  // #region Deny User Account
  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can deny a user account",
  })
  @HeaderParam("auth")
  @Put("/:id/deny")
  @OpenAPI({
    summary: "Deny user account",
    security: [{ bearerAuth: [] }],
  })
  async denyUserAccount(@Param("id") id: string): Promise<void> {
    if (!isMongoId(id)) throwError("Invalid or missing user's id", 400);

    this._logger.info(`Denying user account with id: ${id}`);

    await this._userRepository.updateUser({ _id: id, verified: false } as User);
  }
  // #endregion
}
