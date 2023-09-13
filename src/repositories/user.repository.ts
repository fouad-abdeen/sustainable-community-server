import Container, { Service } from "typedi";
import {
  BaseRepository,
  IMongoConnection,
  MongoConnectionProvider,
} from "../core";
import { IUserRepository } from "./interfaces";
import { User } from "../models";

@Service()
export class UserRepository extends BaseRepository implements IUserRepository {
  private readonly _connection: IMongoConnection<User>;

  constructor(private mongoService?: MongoConnectionProvider) {
    if (!mongoService) mongoService = Container.get(MongoConnectionProvider);
    super(__filename, mongoService);
    this._connection = mongoService.getConnection(User, this._logger);
  }

  async createUser(user: User): Promise<User> {
    this._logger.info(`Creatign user with email: ${user.email}`);
    const addedUser = await this._connection.insertOne({
      ...user,
      createdAt: +new Date(),
    });
    return addedUser;
  }

  async updateUser(user: User): Promise<User> {
    this._logger.info(`Updating user with id: ${user._id}`);
    return await this._connection.updateOne(
      { _id: user._id },
      { ...user, updatedAt: +new Date() }
    );
  }

  async getUserById(id: string): Promise<User> {
    this._logger.info(`Getting user by id: ${id}`);
    try {
      const user = await this._connection.queryOne({ _id: id });
      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new Error(`User with id ${id} not found`);
    }
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
}
