import {
  JwtPayload,
  sign,
  SignOptions,
  TokenExpiredError,
  verify,
  VerifyOptions,
} from "jsonwebtoken";
import { IAuthTokenProvider, TokenSignOptions } from "./auth.interface";

export class AuthTokenProvider implements IAuthTokenProvider {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  generateToken<T>(payload: T, options: TokenSignOptions): string {
    let token: string;

    if (typeof payload === "string" || Buffer.isBuffer(payload)) {
      // Do shallow copying to remove property `expiresIn` from the original object,
      // as we can set the expiration only if the payload is object literal.
      const signOptions = options as SignOptions;
      delete signOptions.expiresIn;
    }

    // #region Validate Token's Expiry Duration
    const { expiresIn } = options;
    let numberOfSeconds = 0;

    if (typeof expiresIn === "number") {
      numberOfSeconds = expiresIn;
    } else if (expiresIn) {
      // If expiry duration is in minutes (e.g: "180m"))
      if (expiresIn[expiresIn.length - 1] === "m")
        // Convert it from mintues to seconds
        numberOfSeconds = parseInt(expiresIn.split("m")[0]) * 60;

      // If expiry duration is in hours (e.g: "6h"))
      if (expiresIn[expiresIn.length - 1] === "h")
        // Convert it from hours to seconds
        numberOfSeconds = parseInt(expiresIn.split("h")[0]) * 3600;

      // If expiry duration is in days (e.g: "1d"))
      if (expiresIn[expiresIn.length - 1] === "d")
        // Convert it from days to seconds
        numberOfSeconds = parseInt(expiresIn.split("d")[0]) * 86400;
    }

    // The maximum value of expiry duration is 48 hours (172800 seconds)
    if (numberOfSeconds > 172800) numberOfSeconds = 172800;
    // #endregion

    try {
      token = sign(payload as any, this.secret, options);
    } catch (error: any) {
      throw new Error(error.message);
    }

    return token;
  }

  verifyToken<T>(
    token: string,
    options?: VerifyOptions,
    skipExpiredError = false
  ): T {
    // Generic type T should extend or implement JwtPayload if it's an interface or a class.
    let payload: T;

    try {
      payload = verify(token, this.secret, options) as T;
    } catch (error: any) {
      if (skipExpiredError && error instanceof TokenExpiredError)
        return { exp: 1 } as T;
      throw new Error(error.message);
    }

    return payload;
  }
}
