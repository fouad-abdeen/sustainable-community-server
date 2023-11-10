import Container, { Service } from "typedi";
import {
  BaseRepository,
  MongoConnection,
  MongoConnectionProvider,
} from "../core";
import { AdminMessage } from "../models";
import { IAdminMessageRepository } from "./interfaces/admin-message.interface";

@Service()
export class AdminMessageRepository
  extends BaseRepository
  implements IAdminMessageRepository
{
  private readonly _connection: MongoConnection<
    AdminMessage,
    typeof AdminMessage
  >;

  constructor(private mongoService: MongoConnectionProvider) {
    if (!mongoService) mongoService = Container.get(MongoConnectionProvider);
    super(__filename, mongoService);
    this._connection = mongoService.getConnection(AdminMessage, this._logger);
  }

  async createMessage(message: AdminMessage): Promise<AdminMessage> {
    this._logger.info(`Creating new message`);

    return await this._connection.insertOne({
      ...message,
      createdAt: Date.now(),
    });
  }

  async getMessages(): Promise<AdminMessage[]> {
    this._logger.info(`Getting all messages`);

    return await this._connection.query({});
  }

  async deleteMessage(id: string): Promise<void> {
    this._logger.info(`Deleting message with id ${id}`);

    await this._connection.deleteOne({ _id: id });
  }
}
