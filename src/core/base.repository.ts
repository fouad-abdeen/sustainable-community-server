import { BaseService, MongoConnectionProvider } from ".";

/**
 * Base repository class.
 * Exposes to the data access layer: the context, logger, and database.
 */
export abstract class BaseRepository extends BaseService {
  protected _mongoService: MongoConnectionProvider;

  constructor(filename: string, mongoService: MongoConnectionProvider) {
    super(filename);
    this._mongoService = mongoService;
  }
}
