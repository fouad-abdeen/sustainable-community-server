import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import { Logger } from "../../..";
import { FilterQuery, UpdateQuery } from "mongoose";

export interface IMongoConnectionProvider {
  /**
   * Establishes a connection to the database.
   * To use at the launch of the app.
   */
  connect(): Promise<void>;

  /**
   * Creates a new wrapper of the connection to the specified database, then returns it.
   * @param cls Unintialized Mongo Class (used to create mongoose model from class).
   * @param logger Logger used in the main app (optional).
   */
  getConnection<T, U extends AnyParamConstructor<T> = AnyParamConstructor<T>>(
    cls: U,
    logger?: Logger
  ): IMongoConnection<T>;

  /**
   * Closes the current connection created when initializing the service.
   */
  closeConnection(): Promise<void>;

  /**
   * Creates a new collection inside the database.
   * @param name Collection name that will be created.
   * @param deletePrevious If set to true, then deletes any existing collection that has the same name. Otherwise, this function safely succeeds.
   */
  createCollection(name: string, deletePrevious?: boolean): Promise<void>;
}

export interface IMongoConnection<T> {
  /**
   * Creates a new record in the collection that the model belongs to.
   * If the collection doesn't exist, a new one will be created based on the Mongoose model.
   * @param object The new record that will be created.
   */
  insertOne(object: T): Promise<T>;

  /**
   * Creates multiple records in the collection that the model belongs to.
   * @param objects The new records that will be created.
   */
  insert(objects: T[]): Promise<T[]>;

  /**
   *  Queries one record depending on certain conditions.
   * @param conditions The conditions to decide which record to query.
   * @param leanEnabled Enable or disable the lean option that tells Mongoose to skip hydrating the result document.
   * @returns Requested object as a document or lean document.
   */
  queryOne<U>(conditions: FilterQuery<U>, leanEnabled?: boolean): Promise<T>;

  /**
   *  Queries multiple records depending on certain conditions.
   * @param options options to apply on the query operation
   * @param leanEnabled Enable or disable the lean option that tells Mongoose to skip hydrating the result document.
   * @returns The requested array of documents, lean documents, or the chosen data structure.
   */
  query<U, V, S>(
    options: MongooseQueryOptions<U, V>,
    leanEnabled?: boolean
  ): Promise<T[] | S>;

  /**
   *  Updates a document with new data depending on certain conditions.
   * @param conditions The conditions to decide which record to update.
   * @param data An object consists of the new data.
   * @param leanEnabled Enable or disable the lean option that tells Mongoose to skip hydrating the result document.
   * @returns Updated object as a document or lean document.
   */
  updateOne<U, V>(
    conditions: FilterQuery<U>,
    data: UpdateQuery<V>,
    leanEnabled?: boolean
  ): Promise<T>;

  /**
   *  Updates multiple documents with new data depending on certain conditions.
   * @param conditions The conditions to decide which records to update.
   * @param data An object consists of the new data.
   */
  update<U, V>(conditions: FilterQuery<U>, data: UpdateQuery<V>): Promise<void>;

  /**
   *  Deletes a document depending on certain conditions.
   * @param conditions The conditions to decide which record to delete.
   * @returns Deleted object as a lean document (lean enabled by default).
   */
  deleteOne<U>(conditions: FilterQuery<U>): Promise<T>;

  /**
   * Deletes multiple documents depending on certain conditions.
   * @param conditions The conditions to decide which records to update.
   */
  delete<U>(conditions: FilterQuery<U>): Promise<void>;
}

export interface MongooseQueryOptions<U, V> {
  // The conditions to decide which record to query
  conditions?: FilterQuery<U>;

  // Apply filters to the query like from/to date
  filters?: V;

  // Retrieve only certain fields
  // Fields' names separated with spaces
  projection?: string;
}
