import { Module } from "@nestjs/common";
import { GigsService } from "./gigs.service";
import { GigsController } from "./gigs.controller";
import { UsersService } from "../users/users.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { TimezonesService } from "src/timezones/timezones.service";
import { LikeService } from "src/utils/like/like.service";
import { CommentService } from "src/utils/comment/comment.service";

@Module({
  controllers: [GigsController],
  providers: [
    GigsService, 
    PrismaService, 
    TimezonesService,
    LikeService,
    CommentService
  ],
})
export class GigsModule {}
