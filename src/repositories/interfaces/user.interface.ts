import { MongooseQueryOptions } from "../../core";
import { User, UserRole } from "../../models";

export interface IUserRepository {
  /**
   * Creates a new user
   * @param user user to create
   */
  createUser(user: User): Promise<User>;

  /**
   * Updates an existing user
   * @param user user to update
   */
  updateUser(user: User): Promise<User>;

  /**
   * Gets user by id
   * @param id user's id
   * @param projection optional fields to return
   */
  getUserById<U>(id: string, projection: string): Promise<User | U>;

  /**
   * Gets user by email
   * @param email user's email
   * @param throwErrorIfUserNotFound In case the user account does not exist,
   * this optional boolean param decides to throw an error or not.
   * By default, it has a value of true.
   */
  getUserByEmail(
    email: string,
    throwErrorIfUserNotFound?: boolean
  ): Promise<User>;

  /**
   * Gets a list of users
   * @param options query options
   */
  getListOfUsers<U>(
    options: MongooseQueryOptions<UserQuery, unknown>
  ): Promise<User[] | U[]>;
}

export interface UserQuery {
  role: UserRole;
  verified: boolean;
}
