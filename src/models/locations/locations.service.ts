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
  ) {}

  getDistanceUsingHarversine(user, saved) {
    // latitude:31.5203696,longitude:74.35874729999999 lahore
    // latitude:33.2615676,longitude:73.3057508 gujar khan
    const a = { latitude: 33.5651107, longitude: 73.0169135 };
    const b = { latitude: 33.2615676, longitude: 73.3057508 };
    const distanceInMeters = haversine(user, saved);
    const distanceInkilometers = distanceInMeters / 1000;
    console.log("distance ", distanceInkilometers);
    return distanceInkilometers;
  }

  async findAll() {
    return await this.prismaService.location.findMany({
      include: {
        post: true,
        user: true,
        event: true,
        gig: true,
      },
    });
  }

  async findOne(_id) {
    try {
      const location = await this.prismaService.location.findFirst({
        where: { id: _id },
        include: {
          post: true,
          user: true,
          event: true,
          gig: true,
        },
      });
      return location;
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  }

  async createMyLocation(data, userId) {
    const address =
      data.city +
      " " +
      data.district +
      " " +
      data.province +
      " " +
      data.country;
    const location = await this.googleMapService.getCoordinates(address);
    console.log("location", location);

    const result = await this.prismaService.location.create({
      data: {
        userId: userId,
        country: data.country,
        province: data.province,
        district: data.district,
        city: data.city,
        location_type: data.location_type,

        Latitude: location.lat,

        Langitude: location.lng,
      },
    });
    if (result) {
      return result;
    }
  }

  async create(data: CreateLocationDto) {
    const address =
      data.city +
      " " +
      data.district +
      " " +
      data.province +
      " " +
      data.country;
    const location = await this.googleMapService.getCoordinates(address);
    console.log("location", location);
    if (data.gigId) {
      const result = await this.prismaService.location.create({
        data: {
          country: data.country,
          province: data.province,
          district: data.district,
          city: data.city,
          gigId: data.gigId,

          location_type: data.location_type,

          Latitude: location.lat,

          Langitude: location.lng,
        },
      });
      if (result) {
        return result;
      } else {
        throw new BadRequestException("Please try again later");
      }
    } else if (data.eventId) {
      const result = await this.prismaService.location.create({
        data: {
          eventId: data.eventId,
          country: data.country,
          province: data.province,
          district: data.district,
          city: data.city,
          location_type: data.location_type,

          Latitude: location.lat,

          Langitude: location.lng,
        },
      });
      if (result) {
        return result;
      } else {
        throw new BadRequestException("Please try again later");
      }
    } else if (data.postId) {
      const result = await this.prismaService.location.create({
        data: {
          postId: data.postId,
          country: data.country,
          province: data.province,
          district: data.district,
          city: data.city,
          location_type: data.location_type,

          Latitude: location.lat,

          Langitude: location.lng,
        },
      });
      if (result) {
        return result;
      } else {
        throw new BadRequestException("Please try again later");
      }
    } else {
      throw new BadRequestException("This id does not exists");
    }
  }
}
