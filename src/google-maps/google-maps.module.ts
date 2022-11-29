import { Module } from "@nestjs/common";
import { GoogleMapsService } from "./google-maps.service";
import { GoogleMapsController } from "./google-maps.controller";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [GoogleMapsController],
  providers: [GoogleMapsService, ConfigService],
})
export class GoogleMapsModule {}
