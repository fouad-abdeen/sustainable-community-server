import Container, { Service } from "typedi";
import {
  BaseRepository,
  IMongoConnection,
  MongoConnectionProvider,
} from "../core";
import { IAuthRepository } from "./interfaces";
import { User } from "../models";

@Service()
export class AuthRepository extends BaseRepository implements IAuthRepository {
  private readonly _connection: IMongoConnection<User>;

  constructor(private mongoService: MongoConnectionProvider) {
    if (!mongoService) mongoService = Container.get(MongoConnectionProvider);
    super(__filename, mongoService);
    this._connection = mongoService.getConnection(User, this._logger);
  }

  async addUser(user: User): Promise<User> {
    this._logger.info(`Adding user with email: ${user.email}`);
    const addedUser = await this._connection.insertOne(user);
    return addedUser;
  }

  async getUserByEmail(
    email: string,
    throwErrorIfUserNotFound = true
  ): Promise<User> {
    this._logger.info(`Getting user by email: ${email}`);
    const user = await this._connection.queryOne({ email });

    if (!user && throwErrorIfUserNotFound) {
      throw new Error(`User with email ${email} not found`);
    }

    return user;
  }

  async updateUser(user: User): Promise<User> {
    this._logger.info(`Updating user with id: ${user._id}`);
    return await this._connection.updateOne({ _id: user._id }, user);
  }
}
