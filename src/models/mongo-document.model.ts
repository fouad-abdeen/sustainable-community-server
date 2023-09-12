import { prop } from "@typegoose/typegoose";

export class MongoDocument {
  /**
   * Mongo Id of object
   */
  public _id?: string;

  /**
   * Created date
   */
  @prop({ type: Number })
  public createdAt?: number;

  /**
   * Key of user who created the object
   */
  @prop({ type: String })
  public createdBy?: string;

  /**
   * Updated date
   */
  @prop({ type: Number })
  public updatedAt?: number;

  /**
   * Key of user who updated the object
   */
  @prop({ type: String })
  public updatedBy?: string;
}
