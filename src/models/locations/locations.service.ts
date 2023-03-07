import { BadRequestException, Injectable } from "@nestjs/common";
import { GoogleMapsService } from "src/google-maps/google-maps.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import * as haversine from "haversine-distance";

@Injectable()
export class LocationsService {
  constructor(
    private prismaService: PrismaService,
    private googleMapService: GoogleMapsService
  ) { }

  getDistanceUsingHaversine(user: any, saved: any) {
    try {
      const a = { latitude: 33.5651107, longitude: 73.0169135 };
      const b = { latitude: 33.2615676, longitude: 73.3057508 };
      const distanceInMeters = haversine(user, saved);
      const distanceInkilometers = distanceInMeters / 1000;
      console.log("distance ", distanceInkilometers);
      return distanceInkilometers;
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAll() {
    try {
      return await this.prismaService.location.findMany({
        include: {
          post: true,
          user: true,
        },
      });
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(_id: string) {
    try {
      const location = await this.prismaService.location.findFirst({
        where: { id: _id },
        include: {
          post: true,
          user: true,
        },
      });
      return location;
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async create(data: CreateLocationDto) {
    try {
      const result = await this.prismaService.location.create({
        data: {
          postId: data.postId,
          address: data.address,
          locationType: data.locationType,
          latitude: data.latitude,
          langitude: data.langitude,
        },
      });
      if (result) {
        return result;
      } else {
        throw new BadRequestException("Please try again later");
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }
}
