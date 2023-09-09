import { Service as service } from "typedi";
import { Interceptor, InterceptorInterface, Action } from "routing-controllers";

/**
 * Intercepts the responses and standardizes the format of the response
 * Format: status + data
 */
@Interceptor()
@service()
export class ResponseInterceptor implements InterceptorInterface {
  intercept(action: Action, content: unknown) {
    return new Response<unknown>(content);
  }
}

/**
 * Success response
 */
export class Response<T> {
  public status: ResponseStatus;
  public data: T;

  constructor(data: T) {
    this.status = "success";
    this.data = data;
  }
}

/**
 * Error Response
 */
export class ErrorResponse {
  public status: ResponseStatus;
  public error: MyError;

  constructor(error: MyError) {
    this.status = "error";
    this.error = error;
  }
}

export type ResponseStatus = "success" | "error";

export type MyError = Error & { errors?: Error[] };
