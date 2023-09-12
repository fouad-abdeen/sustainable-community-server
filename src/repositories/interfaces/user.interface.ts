import { User } from "../../models";

export interface IUserRepository {
  /**
   * Creates a new user in the database
   * @param user user to create in the database
   */
  createUser(user: User): Promise<User>;

  /**
   * Updates user's data
   * @param user user's data to update
   */
  updateUser(user: User): Promise<User>;

  /**
   * Gets user by id
   * @param id user's id
   */
  getUserById(id: string): Promise<User>;

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
}
