import {
  Authorized,
  Body,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { BaseService, throwError } from "../core";
import { AuthInfo, AuthService, Tokens } from "../services";
import {
  LoginRequest,
  PasswordResetRequest,
  PasswordUpdateRequest,
  RefreshTokenRequest,
  SignupRequest,
} from "./request/auth.request";
import { CustomerProfile, UserRole, SellerProfile, User } from "../models";
import { UserRepository } from "../repositories";
import { isMongoId } from "class-validator";

@JsonController("/auth")
@Service()
export class AuthController extends BaseService {
  constructor(
    private _authService: AuthService,
    private _userRepository: UserRepository
  ) {
    super(__filename);
  }

  // #region Login
  @Post("/login")
  @OpenAPI({
    summary: "Authenticate user",
    responses: {
      "401": {
        description: "Authentication failed",
      },
    },
  })
  @ResponseSchema(AuthInfo)
  async login(
    @Body({ required: true }) loginRequest: LoginRequest
  ): Promise<AuthInfo> {
    this._logger.info(
      `Requesting login for user with email ${loginRequest.email}`
    );
    return await this._authService.authenticateUser(loginRequest);
  }
  // #endregion

  // #region Logout
  @Authorized()
  @Get("/logout")
  @OpenAPI({
    summary: "Sign out user",
    responses: {
      "403": {
        description: "Sign out failed",
      },
    },
  })
  async logout(
    @QueryParam("accessToken", { required: true }) accessToken: string,
    @QueryParam("refreshToken", { required: true }) refreshToken: string
  ): Promise<void> {
    this._logger.info("Requesting user logout");
    await this._authService.signOutUser({ accessToken, refreshToken });
  }
  // #endregion

  // #region Signup
  @Post("/signup")
  @OpenAPI({
    summary: "Sign up user",
    responses: {
      "400": {
        description: "Signup failed",
      },
    },
  })
  async signup(
    @Body({ required: true }) signupRequest: SignupRequest
  ): Promise<AuthInfo> {
    const { email, password, role } = signupRequest;

    this._logger.info(`Requesting signup for user with email ${email}`);

    return await this._authService.signUpUser({
      email,
      password,
      role: role,
      profile:
        role === UserRole.SELLER
          ? ({
              name: signupRequest.sellerName,
              categoryId: signupRequest.categoryId,
            } as SellerProfile)
          : ({
              firstName: signupRequest.firstName,
              lastName: signupRequest.lastName,
            } as CustomerProfile),
    } as User);
  }
  // #endregion

  // #region Verify Email Address
  @Put("/email/verify")
  @OpenAPI({
    summary: "Verify email address",
    responses: {
      "400": {
        description: "Email verification failed",
      },
    },
  })
  async verifyEmail(@QueryParam("token") token: string): Promise<void> {
    this._logger.info("Requesting email address verification");
    await this._authService.verifyEmailAddress(token);
  }
  // #endregion

  // #region Request Password Reset
  @Get("/password")
  @OpenAPI({
    summary: "Send password reset link",
    responses: {
      "403": {
        description: "Requesting password reset failed",
      },
    },
  })
  async requestPasswordReset(
    @QueryParam("email") email: string
  ): Promise<void> {
    this._logger.info(
      `Requesting password reset token for user with email ${email}`
    );
    await this._authService.sendPasswordResetLink(email);
  }
  // #endregion

  // #region Reset Password
  @Post("/password")
  @OpenAPI({
    summary: "Reset user's password",
    responses: {
      "403": {
        description: "Password reset failed",
      },
    },
  })
  async resetPassword(
    @Body() { token, password }: PasswordResetRequest
  ): Promise<void> {
    this._logger.info("Requesting password reset");
    await this._authService.resetPassword(token, password);
  }
  // #endregion

  // #region Update Password
  @Authorized()
  @Put("/password")
  @OpenAPI({
    summary: "Update user's password",
    responses: {
      "403": {
        description: "Password update failed",
      },
    },
  })
  async updatePassword(
    @Body() { currentPassword, newPassword }: PasswordUpdateRequest
  ): Promise<void> {
    this._logger.info("Requesting password update");
    await this._authService.updatePassword(currentPassword, newPassword);
  }
  // #endregion

  // #region Refresh Access Token
  @Put("/token/refresh")
  @OpenAPI({
    summary: "Refresh access token",
    responses: {
      "403": {
        description: "Unauthorized request",
      },
    },
  })
  async refreshAccessToken(
    @Body() { refreshToken }: RefreshTokenRequest
  ): Promise<Tokens> {
    this._logger.info("Requesting access token refresh");
    return this._authService.refreshAccessToken(refreshToken);
  }
  // #endregion

  // #region Acknowledge User Account
  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can acknowledge a user account",
  })
  @Put("/users/:id/acknowledge")
  @OpenAPI({
    summary: "Acknowledge user account",
    responses: {
      "403": {
        description: "Failed to acknowledge user account",
      },
    },
  })
  async acknowledgeUserAccount(@Param("id") id: string): Promise<void> {
    if (!isMongoId(id)) throwError("Invalid or missing user's id", 400);

    this._logger.info(`Acknowledging user account with id: ${id}`);

    await this._userRepository.updateUser({ _id: id, verified: true } as User);
  }
  // #endregion

  // #region Deny User Account
  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can deny a user account",
  })
  @Put("/users/:id/deny")
  @OpenAPI({
    summary: "Deny user account",
    responses: {
      "403": {
        description: "Failed to deny user account",
      },
    },
  })
  async denyUserAccount(@Param("id") id: string): Promise<void> {
    if (!isMongoId(id)) throwError("Invalid or missing user's id", 400);

    this._logger.info(`Denying user account with id: ${id}`);

    await this._userRepository.updateUser({ _id: id, verified: false } as User);
  }
  // #endregion
}
