import { Module, ValidationPipe } from "@nestjs/common";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./utils/auth/auth.module";
import { MagicModule } from "./utils/magic/magic.module";
// import { JwtAuthGuard } from "./utils/auth/guards/jwt-auth.guard";
// import { MagicAuthGuard } from "./utils/magic/guards/magic.guard";
import { UsersModule } from "./models/users/users.module";
import { TokensModule } from "./utils/tokens/tokens.module";
import { EventsModule } from "./models/events/events.module";
import { GigsModule } from "./models/gigs/gigs.module";
import { PostsModule } from "./models/posts/posts.module";
import { LocationsModule } from "./models/locations/locations.module";
import { ImagesModule } from "./images/images.module";
import { TimezonesModule } from "./timezones/timezones.module";
import { PrismaService } from "./utils/prisma/prisma.service";
import { ChatsModule } from "./chats/chats.module";
import { ContactsModule } from "./chats/contacts/contacts.module";
import { JobProfileModule } from "./job-profile/job-profile.module";
import { GoogleMapsModule } from "./google-maps/google-maps.module";
import { GlobalSearchModule } from "./global-search/global-search.module";
import { CollabModule } from "./models/collab/collab.module";

@Module({
  imports: [
    AuthModule,
    MagicModule,
    UsersModule,
    TokensModule,
    GoogleMapsModule,
    EventsModule,
    GigsModule,
    PostsModule,
    LocationsModule,
    ImagesModule,
    TimezonesModule,
    ChatsModule,
    ContactsModule,
    JobProfileModule,
    GlobalSearchModule,
    CollabModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: MagicAuthGuard,
    // },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
