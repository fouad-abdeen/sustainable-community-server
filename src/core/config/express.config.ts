import express from "express";
import * as httpContext from "express-http-context";
import { Action, useContainer, useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import { env } from ".";
import swaggerUiExpress from "swagger-ui-express";
import { getSwaggerSpec } from "./swagger.config";
import { AuthService } from "../../services";

export class Express {
  readonly app: express.Application;
  private _authService: AuthService;

  constructor(dirname: string) {
    this.app = express();

    this.app.use(httpContext.middleware);

    //Attach Routing Controllers container to Type DI
    useContainer(Container);

    this.configExpress(dirname);
    this.configHealthRoute();
    this.configSwaggerRoute(dirname);
  }

  configExpress(dirname: string) {
    this.app.listen(env.app.port);

    useExpressServer(this.app, {
      cors: true,
      classTransformer: true,
      defaultErrorHandler: false,
      routePrefix: env.app.routePrefix,

      controllers: [dirname + "/controllers/*.ts"],
      middlewares: [dirname + "/core/middlewares/*.ts"],
      interceptors: [dirname + "/core/interceptors/*.ts"],

      authorizationChecker: async (action: Action, roles: any) => {
        if (!this._authService) this._authService = Container.get(AuthService);
        await this._authService.authorizeUser(action, roles);
        return true;
      },
    });
  }

  configHealthRoute() {
    this.app.get("/health", (req: express.Request, res: express.Response) => {
      res.json({
        name: env.app.name,
        version: env.app.version,
        description: env.app.description,
      });
    });
  }

  configSwaggerRoute(dirname: string) {
    this.app.use(
      "/docs",
      swaggerUiExpress.serve,
      swaggerUiExpress.setup(getSwaggerSpec(dirname))
    );
  }
}
