import Container, { Service } from "typedi";
import {
  BaseRepository,
  MongoConnection,
  MongoConnectionProvider,
  MongooseQueryOptions,
  throwError,
} from "../core";
import { IUserRepository, UserQuery } from "./interfaces";
import { User } from "../models";

@Service()
export class UserRepository extends BaseRepository implements IUserRepository {
  private readonly _connection: MongoConnection<User, typeof User>;

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
      passwordUpdatedAt: +new Date(),
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

  async getUserById<U>(id: string, projection?: string): Promise<User | U> {
    this._logger.info(`Getting user by id: ${id}`);

    const user = await this._connection.queryOne<{ _id: string }, User | U>(
      {
        _id: id,
      },
      projection
    );

    if (!user) throwError(`User with id ${id} not found`, 404);

    return user;
  }

  async getUserByEmail(
    email: string,
    throwErrorIfUserNotFound = true
  ): Promise<User> {
    this._logger.info(`Getting user by email: ${email}`);

    const user = await this._connection.queryOne<{ email: string }, User>({
      email,
    });

    if (!user && throwErrorIfUserNotFound)
      throwError(`User with email ${email} not found`, 404);

    return user;
  }

  async getListOfUsers<U>(
    options: MongooseQueryOptions<UserQuery, unknown>
  ): Promise<User[] | U[]> {
    const conditions = options.conditions as UserQuery;

    this._logger.info(
      `Getting list of users with the properties: ${JSON.stringify(
        conditions,
        null,
        2
      )}`
    );

    const users = await this._connection.query<UserQuery, unknown, User[]>({
      conditions,
      projection: options.projection,
      sort: { createdAt: -1 },
    });

    if (!users || users.length === 0)
      throwError(
        `No users found with the properties: ` +
          `role: ${conditions.role}, verified: ${conditions.verified}`,
        404
      );

    return users;
  }
}
