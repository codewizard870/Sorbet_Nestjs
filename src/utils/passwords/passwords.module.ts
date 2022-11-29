import { Module } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { TokensService } from "src/utils/tokens/tokens.service";
import { PasswordsController } from "./passwords.controller";
import { PasswordsService } from "./passwords.service";

@Module({
  controllers: [PasswordsController],
  providers: [PasswordsService, PrismaService, TokensService],
})
export class PasswordsModule {}
