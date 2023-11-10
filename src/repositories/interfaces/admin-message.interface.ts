import { AdminMessage } from "../../models";

export interface IAdminMessageRepository {
  /**
   * Creates a new message
   * @param message message to create
   */
  createMessage(message: AdminMessage): Promise<AdminMessage>;

  /**
   * Gets all messages
   */
  getMessages(): Promise<AdminMessage[]>;

  /**
   *
   * @param id message id
   */
  deleteMessage(id: string): Promise<void>;
}
