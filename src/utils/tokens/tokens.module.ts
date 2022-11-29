import { Module } from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { TokensController } from "./tokens.controller";
import { PrismaService } from "src/utils/prisma/prisma.service";

@Module({
  controllers: [TokensController],
  providers: [TokensService, PrismaService],
})
export class TokensModule {}
