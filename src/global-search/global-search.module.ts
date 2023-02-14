import { Module } from "@nestjs/common";
import { GlobalSearchService } from "./global-search.service";
import { GlobalSearchController } from "./global-search.controller";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "src/models/users/users.service";
import { EventsService } from "src/models/events/events.service";
import { GigsService } from "src/models/gigs/gigs.service";
import { PostsService } from "src/models/posts/posts.service";
import { GroupsService } from "src/models/groups/groups.service";
import { LocationsService } from "src/models/locations/locations.service";
import { PasswordsService } from "src/utils/passwords/passwords.service";
import { TokensService } from "src/utils/tokens/tokens.service";
import { TimezonesService } from "src/timezones/timezones.service";
import { GoogleMapsService } from "src/google-maps/google-maps.service";
import { ConfigService } from "@nestjs/config";

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
    EventsService,
    GigsService,
    PostsService,
    GroupsService,
    LocationsService,
  ],
})
export class GlobalSearchModule {}
