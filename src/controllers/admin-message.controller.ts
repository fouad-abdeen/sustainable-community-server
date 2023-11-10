import {
  Body,
  JsonController,
  Get,
  Post,
  Authorized,
  Delete,
  HeaderParam,
  Param,
} from "routing-controllers";
import { Service } from "typedi";
import { BaseService } from "../core";
import { AdminMessageRepository } from "../repositories";
import { UserRole } from "../models";
import { AdminMessageCreateRequest } from "./request";
import { AdminMessageResponse } from "./response";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Response } from "../core/interceptors/response.interceptor";

@JsonController("/messages")
@Service()
export class AuthController extends BaseService {
  constructor(private _adminMessageRepository: AdminMessageRepository) {
    super(__filename);
  }

  // #region Create Message
  @Post("/")
  @OpenAPI({
    summary: "Create a new message",
  })
  async createMessage(
    @Body() request: AdminMessageCreateRequest
  ): Promise<void> {
    this._logger.info(`Submitting a new message`);

    await this._adminMessageRepository.createMessage(request);
  }
  // #endregion

  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can get all messages",
  })
  @HeaderParam("auth")
  @OpenAPI({
    summary: "Get all messages",
  })
  @ResponseSchema(AdminMessageResponse, { isArray: true })
  @Get("/")
  async getMessages(): Promise<AdminMessageResponse[]> {
    this._logger.info(`Getting all messages`);

    return AdminMessageResponse.getListOfMessagesResponse(
      await this._adminMessageRepository.getMessages()
    );
  }

  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can delete messages",
  })
  @Delete("/:id")
  async deleteMessage(@Param("id") id: string): Promise<void> {
    this._logger.info(`Deleting message with id ${id}`);

    await this._adminMessageRepository.deleteMessage(id);
  }
}
