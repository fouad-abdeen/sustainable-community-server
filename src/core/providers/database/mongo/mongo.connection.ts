import { getModelForClass } from "@typegoose/typegoose";
import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import { Model, Connection, FilterQuery, UpdateQuery } from "mongoose";
import { IMongoConnection, MongooseQueryOptions } from "./mongo.interface";
import Wrapper from "../../wrapper.abstract";
import { Logger } from "../../..";

export class MongoConnection<T, U extends AnyParamConstructor<T>>
  extends Wrapper<Connection>
  implements IMongoConnection<T>
{
  protected instance: Connection;
  private _model: Model<any>;

  /**
   * Wraps the mongo connection with functions to query the database
   * @param documentClass Unintialized MongoDB Document Class (used to create a mongoose model)
   * @param connection Mongoose Connection
   * @param logger Optional: logger to use for logging
   */
  constructor(documentClass: U, connection: Connection, logger?: Logger) {
    super(logger);
    this.instance = connection;

    // If no Mongoose Model exists for this class yet, one will be created automatically.
    // Under the hood, typegoose calls mongoose.model function and passes to it the above class' name and schema.
    // mongoose.model takes a collection name (will be pluralized and transformed to lowercase form) and optionally the schema.
    this._model = getModelForClass(documentClass, {
      existingConnection: this.instance,
    });
  }

  async insertOne(object: T): Promise<T> {
    try {
      const document = new this._model(object);
      await document.save();
      return document;
    } catch (err) {
      this.logger.error("An error has occurred during the insert", err);
      throw new Error("Unable to add value to the database");
    }
  }

  async insert(objectsList: T[]): Promise<T[]> {
    try {
      const documentsList: Array<T> = [];
      for (const object of objectsList) {
        const document = new this._model(object);
        await document.save();
        documentsList.push(document);
      }
      return documentsList;
    } catch (err) {
      this.logger.error("An error has occurred during bulk insert", err);
      throw new Error("Unable to add values to the database");
    }
  }

  async queryOne<U>(
    conditions: FilterQuery<U>,
    projection?: string
  ): Promise<T> {
    try {
      // 1. When using lean(), Mongoose returns plain JSON objects instead of memory and resource-heavy documents. It makes queries faster and less expensive on the CPU.
      //    The downside of enabling lean is that lean docs don't have: change tracking, casting and validation, getters and setters, virtuals, and save().
      // 2. When using Promises in combination with Mongoose async operations, note that Mongoose queries are not Promises.
      //    Queries do return a thenable. But, if you need a real Promise, you should use the exec method.
      return (await this._model
        .findOne(conditions, projection)
        .lean()
        .exec()) as T;
    } catch (err) {
      this.logger.error("An error has occurred while executing queryOne", err);
      throw new Error("Unable to get value from the database");
    }
  }

  async query<U, V, S>(options: MongooseQueryOptions<U, V>): Promise<T[] | S> {
    const { conditions, filters, projection } = options;

    try {
      return await this._model
        .find(conditions ? conditions : {}, projection)
        .where(filters ? filters : {})
        .lean()
        .exec();
    } catch (err) {
      this.logger.error("An error has occured while executing query", err);
      throw new Error("Unable to get values from the database");
    }
  }

  async updateOne<U, V>(
    conditions: FilterQuery<U>,
    data: UpdateQuery<V>
  ): Promise<T> {
    try {
      return (await this._model
        .findOneAndUpdate(conditions, data, { new: true })
        .lean()
        .exec()) as T;
    } catch (err) {
      this.logger.error("An error has occurred while executing updateOne", err);
      throw new Error("Unable to update the value in the database");
    }
  }

  async update<U, V>(
    conditions: FilterQuery<U>,
    data: UpdateQuery<V>
  ): Promise<void> {
    try {
      await this._model.updateMany(conditions, data).lean().exec();
    } catch (err) {
      this.logger.error("An error has occurred while executing update", err);
      throw new Error("Unable to update the values in the database");
    }
  }

  async deleteOne<U>(conditions: FilterQuery<U>): Promise<T> {
    try {
      return (await this._model
        .findOneAndDelete(conditions)
        .lean()
        .exec()) as T;
    } catch (err) {
      this.logger.error("An error has occurred while executing deleteOne", err);
      throw new Error("Unable to delete the value in the database");
    }
  }

  async delete<U>(conditions: FilterQuery<U>): Promise<void> {
    try {
      await this._model.deleteMany(conditions).lean().exec();
    } catch (err) {
      this.logger.error("An error has occurred while executing delete", err);
      throw new Error("Unable to delete the values in the database");
    }
  }
}
