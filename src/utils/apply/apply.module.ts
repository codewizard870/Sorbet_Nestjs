import { Module } from "@nestjs/common";
import { ApplyController } from "./apply.controller";
import { ApplyService } from "./apply.service";
import { PrismaService } from "src/utils/prisma/prisma.service";

@Module({
  controllers: [ApplyController],
  providers: [ApplyService, PrismaService],
})
export class ApplyModule {}
