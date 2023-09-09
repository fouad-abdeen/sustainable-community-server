import path from "path";
import fs from "fs";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { defaultMetadataStorage as classTransformerdefaultMetadataStorage } from "class-transformer/cjs/storage";
import { env } from ".";
import { defaultLogger as logger } from "..";

export const getSwaggerSpec = (dirname: string) => {
  const routingControllersOptions = {
    controllers: [dirname + "/controllers/*.ts"],
    routerPrefix: env.app.routePrefix,
  };

  const schemas = validationMetadatasToSchemas({
    classTransformerMetadataStorage: classTransformerdefaultMetadataStorage,
    refPointerPrefix: "#/components/schemas/",
  });

  const storage = getMetadataArgsStorage();

  const spec = routingControllersToSpec(storage, routingControllersOptions, {
    components: { schemas: { ...schemas } as { [schema: string]: any } },
    info: {
      description: "Generated with `routing-controllers-openapi`",
      title: `${env.app.name} API`,
      version: `${env.app.version}`,
    },
  });

  fs.writeFile(
    path.resolve(process.cwd(), "docs/swagger.json"),
    JSON.stringify(spec, null, 4),
    (error) => {
      if (error) {
        logger.error(error.message);
      }
    }
  );

  return spec;
};
