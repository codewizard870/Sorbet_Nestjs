import { Module } from "@nestjs/common";
import { MagicController } from "./magic.controller";
import { SessionSerializer } from "./session.serializer";
import { CustomStrategy } from "./magic.service";

@Module({
  controllers: [MagicController],
  providers: [SessionSerializer, CustomStrategy],
})
export class MagicModule {}