import { Module } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { GroupsController } from "./groups.controller";
import { UsersService } from "../users/users.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { TimezonesService } from "src/timezones/timezones.service";

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, PrismaService, TimezonesService],
})
export class GigsModule {}
