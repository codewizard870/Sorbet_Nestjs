import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { NotificationGateway } from "../websocket/notification.gateway";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, PrismaService, NotificationGateway],
})
export class NotificationModule {}
