import { Module } from "@nestjs/common";
import { GlobalSearchService } from "./global-search.service";
import { GlobalSearchController } from "./global-search.controller";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "src/models/users/users.service";
import { PostsService } from "src/models/posts/posts.service";
import { GroupsService } from "src/models/groups/groups.service";
import { LocationsService } from "src/models/locations/locations.service";
import { PasswordsService } from "src/utils/passwords/passwords.service";
import { TokensService } from "src/utils/tokens/tokens.service";
import { TimezonesService } from "src/timezones/timezones.service";
import { GoogleMapsService } from "src/google-maps/google-maps.service";
import { ConfigService } from "@nestjs/config";
import { LikeService } from "src/utils/like/like.service";
import { CommentService } from "src/utils/comment/comment.service";

@Module({
  controllers: [GlobalSearchController],
  providers: [
    GlobalSearchService,
    PasswordsService,
    TokensService,
    TimezonesService,
    GoogleMapsService,
    ConfigService,
    PrismaService,
    UsersService,
    PostsService,
    GroupsService,
    LocationsService,
    LikeService,
    CommentService
  ],
})
export class GlobalSearchModule {}
