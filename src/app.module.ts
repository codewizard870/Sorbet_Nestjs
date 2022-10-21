import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './utils/auth/auth.module';
import { JwtAuthGuard } from './utils/auth/guards/jwt-auth.guard';
import { UsersModule } from './models/users/users.module';
import { TokensModule } from './utils/tokens/tokens.module';
import { EventsModule } from './models/events/events.module';
import { GigsModule } from './models/gigs/gigs.module';
import { PostsModule } from './models/posts/posts.module';
import { LocationsModule } from './models/locations/locations.module';

@Module({
  imports: [AuthModule, UsersModule, TokensModule, EventsModule, GigsModule, PostsModule, LocationsModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
