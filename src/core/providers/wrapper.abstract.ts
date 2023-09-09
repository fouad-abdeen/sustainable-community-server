import { Logger } from "..";
import Service from "./service.abstract";

/**
 * This is an abstract class that should be implemented by all services that have a purpose of wrapping modules with custom functionalities.
 *
 * It contains the abstract `instance` variable that should be defined in an instance extending this wrapper (such as `MongoDB`)
 *
 * There is also the inherited logger that can be used throughout all custom functions, and a `getInstance` method that returns
 * the protected `instance` variable to the client.
 */
abstract class Wrapper<T> extends Service {
  /**
   * The variable that will be declared in a class instance
   */
  protected abstract instance: T;

  /**
   * Only used to initiate the logger with the logger (optional)
   * @param logger (optional) we can pass the logger used in the main app. If not provided, a default logger will be used.
   */
  constructor(logger?: Logger) {
    super(logger);
  }

  public getInstance() {
    return this.instance;
  }
}

export default Wrapper;
