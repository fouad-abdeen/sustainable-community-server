import { prop } from "@typegoose/typegoose";
import { MongoDocument } from "./mongo-document.model";
import { CategoryType } from "./common";

export class Category extends MongoDocument {
  @prop({ required: true, type: String })
  name: string;

  @prop({ required: true, type: String })
  description: string;

  @prop({ required: true, type: Object })
  type: CategoryType;
}
