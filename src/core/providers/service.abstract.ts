import { Logger } from "..";

/**
 * This is an abstract class that should be implemented by all providers.
 *
 * There is the logger that can be used throughout all custom functions.
 */
abstract class Service {
  protected logger: Logger;

  /**
   * Used to initialize the logger
   * @param logger (optional) we can pass the logger used in the main app. If not provided, a default logger will be used.
   */
  constructor(logger?: Logger) {
    if (logger) this.logger = logger;
    else this.logger = new Logger();
  }
}

export default Service;
