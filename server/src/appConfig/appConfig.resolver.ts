import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { AppConfigResolverBase } from "./base/appConfig.resolver.base";
import { AppConfig } from "./base/AppConfig";
import { AppConfigService } from "./appConfig.service";

@graphql.Resolver(() => AppConfig)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class AppConfigResolver extends AppConfigResolverBase {
  constructor(
    protected readonly service: AppConfigService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
