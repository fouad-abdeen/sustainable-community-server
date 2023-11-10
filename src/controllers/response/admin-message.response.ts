import { IsNumber, IsString } from "class-validator";
import { AdminMessage } from "../../models";

export class AdminMessageResponse {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  message: string;

  @IsNumber()
  createdAt?: number;

  public static getListOfMessagesResponse(
    messages: AdminMessage[]
  ): AdminMessageResponse[] {
    return messages.map((message) => {
      return {
        id: (message._id as string).toString(),
        name: message.name,
        email: message.email,
        message: message.message,
        createdAt: message.createdAt,
      };
    });
  }
}
