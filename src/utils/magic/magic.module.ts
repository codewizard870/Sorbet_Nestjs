import { Module } from "@nestjs/common";
import { MagicController } from "./magic.controller";
import { SessionSerializer } from "./serializer/session.serializer";
import { CustomStrategy } from "./strategies/magic.strategy";
import { UsersService } from "src/models/users/users.service";
import { PrismaService } from "../prisma/prisma.service";
import { MagicAuthGuard } from "./guards/magic.guard";
import { UsersModule } from "src/models/users/users.module";
import { PasswordsService } from "../passwords/passwords.service";
import { TokensService } from "../tokens/tokens.service";
import { MagicService } from "./magic.service";


@Module({
  imports: [
    UsersModule,
    // MagicAuthGuard
  ],
  controllers: [MagicController],
  providers: [MagicService, UsersService, SessionSerializer, CustomStrategy, PrismaService, PasswordsService, TokensService, MagicAuthGuard],
  exports: [],
})
export class MagicModule {}