import { Module } from "@nestjs/common";
import { NearService } from "./near.service";
import { NearController } from "./near.controller";

@Module({
  controllers: [NearController],
  providers: [NearService],
})
export class NearModule {}
