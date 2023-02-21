import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerPath = "api";

export const swaggerDocumentOptions = new DocumentBuilder()
  .setTitle("My app")
  .setDescription(
    "\n\n## Congratulations! Your application is ready.\n  \n    Please note that all endpoints are secured with JWT Bearer authentication.Use the authentification service of supabase to authenticate.\n    (https://supabase.com/docs/gotrue/server/about#put-user)\n    Learn more in [our docs](https://docs.amplication.com)"
  )
  .setVersion("tlurf1w4")
  .addServer("/nest")
  .addBearerAuth()
  .build();

export const swaggerSetupOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCssUrl: "../swagger/swagger.css",
  customfavIcon: "../swagger/favicon.png",
  customSiteTitle: "My app",
};
