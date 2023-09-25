import {
  Authorized,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Put,
  QueryParams,
} from "routing-controllers";
import { BaseService, throwError } from "../core";
import { Service } from "typedi";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { UserRepository } from "../repositories";
import { UserQuery } from "./request";
import { User, UserBriefInfo, UserRole } from "../models";
import { UserResponse } from "./response";
import { isMongoId } from "class-validator";

@JsonController("/users")
@Service()
export class UserController extends BaseService {
  constructor(private _userRepository: UserRepository) {
    super(__filename);
  }

  // #region Get User
  @Authorized({
    roles: ["admin"],
    disclaimer: "Only admins can get user's info",
  })
  @HeaderParam("auth", { required: true })
  @Get("/:id")
  @OpenAPI({
    summary: "Get user by id",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(UserResponse)
  async getOneUser(@Param("id") id: string): Promise<UserResponse> {
    this._logger.info(`Received a request to get user with id: ${id}`);

    if (!isMongoId(id)) throwError("Invalid or missing user's id", 400);

    return UserResponse.getUserResponse(
      await this._userRepository.getUserById<User>(id)
    );
  }
  // #endregion

  // #region Get List of Users
  @Authorized({
    roles: ["admin"],
    disclaimer: "Only admins can get list of users",
  })
  @HeaderParam("auth", { required: true })
  @Get("/")
  @OpenAPI({
    summary: "Get list of users",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(UserBriefInfo, { isArray: true })
  async getListOfUsers(
    @QueryParams() conditions: UserQuery
  ): Promise<UserBriefInfo[]> {
    this._logger.info(
      `Received a request to get list of users with the properties: ${JSON.stringify(
        conditions,
        null,
        2
      )}`
    );

    return (await this._userRepository.getListOfUsers<UserBriefInfo>({
      conditions,
      projection: "id email role verified",
    })) as UserBriefInfo[];
  }
  // #endregion

  // #region Acknowledge User Account
  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can acknowledge a user account",
  })
  @HeaderParam("auth", { required: true })
  @Put("/users/:id/acknowledge")
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
  @HeaderParam("auth", { required: true })
  @Put("/users/:id/deny")
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
