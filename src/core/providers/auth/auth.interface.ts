import { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";

export interface IAuthHashProvider {
  /**
   * Hashes a password
   * @param password password to hash
   * @returns hashed password
   */
  hashPassword(password: string): string;

  /**
   * Verifies a password against a hashed password
   * @param password password to verify
   * @param hash hashed password
   * @returns true if the password matches the hashed password and false otherwise
   */
  verifyPassword(password: string, hash: string): boolean;
}

export interface IAuthTokenProvider {
  /**
   * Generates or signs a JWT token
   * @param payload data to store in the token. It can be a string, buffer, or plain object
   * @param options token sign options that mainly must include the expiry duration (expiresIn),
   * the value of this property should be a number of seconds or a string that represents a timespan like "1d", "24h", or "1440m"
   * @returns generated JWT token
   */
  generateToken<T>(payload: T, options: TokenSignOptions): string;

  /**
   * Verifies the signature of a JWT token and decodes the payload if the signature is valid
   *
   * @param token JWT token to verify
   * @param options options for the verification
   * @returns decoded payload
   */
  verifyToken<T>(token: string, options?: VerifyOptions): T;
}

export interface TokenSignOptions extends SignOptions {
  expiresIn: string | number;
}

export type TokenPayload = JwtPayload;
