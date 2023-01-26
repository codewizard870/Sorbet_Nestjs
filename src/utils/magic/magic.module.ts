import { Module } from "@nestjs/common";
import { MagicController } from "./magic.controller";
import { SessionSerializer } from "./serializer/session.serializer";
import { CustomStrategy } from "./strategies/magic.strategy";
import { UsersService } from "src/models/users/users.service";
import { PrismaService } from "../prisma/prisma.service";
import { MagicAuthGuard } from "./guards/magic.guard";
import { UsersModule } from "src/models/users/users.module";


@Module({
  imports: [
    UsersModule,
    // MagicAuthGuard
  ],
  controllers: [MagicController],
  providers: [UsersService, SessionSerializer, CustomStrategy, PrismaService],
  exports: [],
})
export class MagicModule {}