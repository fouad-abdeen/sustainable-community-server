import { prop } from "@typegoose/typegoose";
import { MongoDocument } from "./mongo-document.model";

export class AdminMessage extends MongoDocument {
  @prop({ required: true, type: String })
  name: string;

  @prop({ required: true, type: String })
  email: string;

  @prop({ required: true, type: String })
  message: string;
}
