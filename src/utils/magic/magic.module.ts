import { Module } from "@nestjs/common";
import { MagicController } from "./magic.controller";

@Module({
  controllers: [MagicController],
})
export class MagicModule {}