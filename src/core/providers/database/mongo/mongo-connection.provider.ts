import { IMongoConnectionProvider } from "./mongo.interface";
import { connect, Connection, connection } from "mongoose";
import { MongoConnection } from "./mongo.connection";
import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import { Logger } from "../../../logger";

export class MongoConnectionProvider implements IMongoConnectionProvider {
  private _connection: Connection;
  private _logger: Logger;
  private _dbHost: string;
  private _dbName: string;

  /**
   * An example of the dbHost (MongoDB cluster): "mongodb+srv://[USERNAME]:[PASSWORD]@sandbox.pim8u.mongodb.net/".
   * Another one (local MongoDB server): "mongodb://localhost:27017/".
   * Check out Connection String URI Format (DB_HOST):
   * https://docs.mongodb.com/manual/reference/connection-string/
   * @param dbHost Connection string URI, including MongoDB cluster/server host
   * @param dbName Database name, will be appended to dbHost
   * @param logger Optional: logger to use for logging
   */
  constructor(dbHost: string, dbName: string, logger: Logger) {
    this._logger = logger;
    this._dbHost = dbHost;
    this._dbName = dbName;
  }

  getConnection<T, U extends AnyParamConstructor<T>>(
    documentClass: U,
    logger?: Logger
  ): MongoConnection<T, U> {
    this.dbConnectionCheck();
    return new MongoConnection(documentClass, this._connection, logger);
  }

  private dbConnectionCheck() {
    if (this._connection) if (Object.keys(this._connection).length > 0) return;
    this._logger.error("MongoDB connection does not exist");
    throw new Error("Error connecting to MongoDB");
  }

  async connect(): Promise<void> {
    try {
      const mongoose = await connect(this._dbHost + this._dbName);
      this._connection = mongoose.connection;
      this._logger.info("Connected to MongoDB");
    } catch (err: any) {
      this._logger.error(
        "An error has occurred while connecting to MongoDB",
        err
      );
      throw new Error(err.message || "Error connecting to MongoDB");
    }
  }

  async closeConnection() {
    await connection.close();
    this._connection = {} as Connection;
    this._logger.info("Disconnected from MongoDB");
  }

  async createCollection(
    name: string,
    deletePrevious?: boolean
  ): Promise<void> {
    this.dbConnectionCheck();

    if (deletePrevious) {
      this._logger.info(
        `Dropping collection ${name} from ${this._connection.db.databaseName}`
      );
      await this._connection.dropCollection(name);
    }

    this._logger.info(
      `Creating collection ${name} in ${this._connection.db.databaseName}`
    );
    await this._connection.createCollection(name);
  }
}
