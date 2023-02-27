import { Module } from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventsController } from "./events.controller";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { TimezonesService } from "src/timezones/timezones.service";
import { LikeService } from "src/utils/like/like.service";
import { CommentService } from "src/utils/comment/comment.service";

@Module({
  controllers: [EventsController],
  providers: [
    EventsService, 
    PrismaService, 
    TimezonesService,
    LikeService,
    CommentService
  ],
})
export class EventsModule {}
