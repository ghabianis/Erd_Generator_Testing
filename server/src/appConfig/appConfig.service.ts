import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { DbService } from "src/dbService/db.service";
import { AppConfigServiceBase } from "./base/appConfig.service.base";

@Injectable()
export class AppConfigService extends AppConfigServiceBase {
  constructor(protected readonly prisma: DbService) {
    super(prisma);
  }
}
