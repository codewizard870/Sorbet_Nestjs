import { Module } from "@nestjs/common";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "src/models/users/users.service";

@Module({
  controllers: [FollowController],
  providers: [FollowService, PrismaService, UsersService],
})
export class FollowModule {}
