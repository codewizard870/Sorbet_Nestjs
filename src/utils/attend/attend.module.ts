import { Module } from "@nestjs/common";
import { AttendController } from "./attend.controller";
import { AttendService } from "./attend.service";
import { PrismaService } from "src/utils/prisma/prisma.service";

@Module({
  controllers: [AttendController],
  providers: [AttendService, PrismaService],
})
export class AttendModule {}
