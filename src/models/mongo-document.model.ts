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
   * Modified date
   */
  @prop({ type: Number })
  public modifiedAt?: number;

  /**
   * Key of user who modified the object
   */
  @prop({ type: String })
  public modifiedBy?: string;
}
