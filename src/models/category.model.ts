import { prop } from "@typegoose/typegoose";
import { MongoDocument } from "./mongo-document.model";

export class Category extends MongoDocument {
  @prop({ required: true, type: String })
  name: string;

  @prop({ required: true, type: String })
  description: string;

  @prop({ required: true, type: Object })
  type: CategoryType;
}

export enum CategoryType {
  item = "Item",
  product = "Product",
  service = "Service",
}
