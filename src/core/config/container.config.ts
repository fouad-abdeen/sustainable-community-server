import { Container } from "typedi";
import { MongoConnectionProvider } from "../providers/database";
import {
  AuthHashProvider,
  AuthTokenProvider,
  Logger,
  MailProvider,
  env,
} from "..";

/**
 * Registers services in container
 * Used for dependency injection
 */
export const registerServices = (logger: Logger) => {
  logger.info("Registering MongoDB Service");
  // Singleton MongoDB Connection
  const mongoService = new MongoConnectionProvider(
    env.mongoDB.host,
    env.mongoDB.database,
    logger
  );
  mongoService.connect();
  Container.set(MongoConnectionProvider, mongoService);

  logger.info("Registering Bcrypt Service");
  Container.set(AuthHashProvider, new AuthHashProvider());

  logger.info("Registering JWT Service");
  Container.set(
    AuthTokenProvider,
    new AuthTokenProvider(env.auth.jwtSecretKey)
  );

  logger.info("Registering Mail Service");
  Container.set(
    MailProvider,
    new MailProvider(env.mail.brevoApiUrl, env.mail.brevoApiKey, {
      name: env.mail.senderName,
      email: env.mail.senderMailAddress,
    })
  );
};
