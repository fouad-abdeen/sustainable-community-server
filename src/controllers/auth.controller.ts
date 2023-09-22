import {
  Authorized,
  Body,
  Get,
  HeaderParam,
  JsonController,
  Post,
  Put,
  QueryParam,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { BaseService } from "../core";
import { AuthService } from "../services";
import {
  LoginRequest,
  PasswordResetRequest,
  PasswordUpdateRequest,
  RefreshTokenRequest,
  SignupRequest,
} from "./request/auth.request";
import {
  CustomerProfile,
  UserRole,
  SellerProfile,
  User,
  Tokens,
} from "../models";
import { AuthResponse } from "./response/auth.response";

@JsonController("/auth")
@Service()
export class AuthController extends BaseService {
  constructor(private _authService: AuthService) {
    super(__filename);
  }

  // #region Login
  @Post("/login")
  @OpenAPI({
    summary: "Authenticate user",
  })
  @ResponseSchema(AuthResponse)
  async login(
    @Body({ required: true }) loginRequest: LoginRequest
  ): Promise<AuthResponse> {
    this._logger.info(
      `Requesting login for user with email ${loginRequest.email}`
    );

    return await this._authService.authenticateUser(loginRequest);
  }
  // #endregion

  // #region Logout
  @Authorized()
  @HeaderParam("auth", { required: true })
  @Get("/logout")
  @OpenAPI({
    summary: "Sign out user",
    security: [{ bearerAuth: [] }],
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
  })
  @ResponseSchema(AuthResponse)
  async signup(
    @Body({ required: true }) signupRequest: SignupRequest
  ): Promise<AuthResponse> {
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
    security: [{ bearerAuth: [] }],
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
  })
  @ResponseSchema(Tokens)
  async refreshAccessToken(
    @Body() { refreshToken }: RefreshTokenRequest
  ): Promise<Tokens> {
    this._logger.info("Requesting access token refresh");

    return this._authService.refreshAccessToken(refreshToken);
  }
  // #endregion
}
