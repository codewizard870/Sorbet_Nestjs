import { Module } from "@nestjs/common";
import { WidgetsService } from "./widgets.service";
import { WidgetsController } from "./widgets.controller";
import { PrismaService } from "src/utils/prisma/prisma.service";

@Module({
  controllers: [WidgetsController],
  providers: [WidgetsService, PrismaService],
})
export class WidgetsModule {}