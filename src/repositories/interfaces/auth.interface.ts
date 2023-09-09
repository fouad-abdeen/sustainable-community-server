import { User } from "../../models";

export interface IAuthRepository {
  /**
   *
   * @param user user to add to the database
   */
  addUser(user: User): Promise<User>;

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
   * Updates user's data
   * @param user user's data to update
   */
  updateUser(user: User): Promise<User>;
}
