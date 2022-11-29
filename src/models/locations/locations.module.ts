import { Module } from "@nestjs/common";
import { LocationsService } from "./locations.service";
import { LocationsController } from "./locations.controller";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { GoogleMapsService } from "src/google-maps/google-maps.service";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [LocationsController],
  providers: [
    LocationsService,
    PrismaService,
    GoogleMapsService,
    ConfigService,
  ],
})
export class LocationsModule {}
