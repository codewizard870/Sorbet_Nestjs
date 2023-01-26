import { Test, TestingModule } from "@nestjs/testing";
import { LocationsController } from "./locations.controller";
import { LocationsService } from "./locations.service";
import { BadRequestException } from "@nestjs/common";
import { GoogleMapsService } from "src/google-maps/google-maps.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateLocationDto, CreateMyLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import * as haversine from "haversine-distance";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import { LocationType } from "@prisma/client";
import * as NodeGeocoder from "node-geocoder";
import { ConfigService } from "@nestjs/config";

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const createLocationDto: CreateLocationDto = {
  location_type: 'OnSite',
  country: 'United States',
  province: 'Massachusetts',
  district: 'Suffolk County',
  city: 'Boston',
  eventId: '000102030405060708090a0b',
  gigId: '000102030405060708090a0b',
  postId: '000102030405060708090a0b'
}

const createMyLocationDto: CreateMyLocationDto = {
  location_type: 'OnSite',
  country: 'United States',
  province: 'Massachusetts',
  district: 'Suffolk County',
  city: 'Boston',
}

const updateLocationDto: UpdateLocationDto = {}

const req = {
  user: {
    id: '000102030405060708090a0b'
  }
}

// Google Maps Mock
const accessKey = process.env.GOOGLE_MAPS_ACCESS_KEY
const options = {
  provider: "google",

  // Optional depending on the providers
  apiKey: accessKey, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

describe("LocationsController", () => {
  let controller: LocationsController;

  let mockGoogleMapsService = {
    getCoordinates: jest.fn().mockImplementation(async (address: string) => {
      try {
        console.log("address in get coordinates", address);
        const geocoder = NodeGeocoder(options);
  
        const res = await geocoder.geocode(address);
        console.log("response", res);
        console.log("latitude", res[0].latitude);
        console.log("longitude", res[0].longitude);
        return {
          lat: res[0].latitude,
          lng: res[0].longitude,
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured, please try again.")
      }
    })
  }

  let mockLocationService = {
    create: jest.fn().mockImplementation(async (user: any, saved: any) => {
      try {
        // latitude:31.5203696,longitude:74.35874729999999 lahore
        // latitude:33.2615676,longitude:73.3057508 gujar khan
        const a = { latitude: 33.5651107, longitude: 73.0169135 };
        const b = { latitude: 33.2615676, longitude: 73.3057508 };
        const distanceInMeters = haversine(user, saved);
        const distanceInkilometers = distanceInMeters / 1000;
        return distanceInkilometers;
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findAll: jest.fn().mockImplementation(async () => {
      try {
        return await prisma.location.findMany({
          include: {
            post: true,
            user: true,
            event: true,
            gig: true,
          },
        });
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findOne: jest.fn().mockImplementation(async (_id: string) => {
      try {
        const location = await prisma.location.findFirst({
          where: { id: _id },
          include: {
            post: true,
            user: true,
            event: true,
            gig: true,
          },
        });
        return location;
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    createMyLocation: jest.fn().mockImplementation(async (data: any, userId: string) => {
      try {
        const address =
          data.city +
          " " +
          data.district +
          " " +
          data.province +
          " " +
          data.country;
        const location = await mockGoogleMapsService.getCoordinates(address);
        console.log("location", location);
        if (data.gigId) {
          const result = await prisma.location.create({
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
          const result = await prisma.location.create({
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
          const result = await prisma.location.create({
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
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),
  }


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        LocationsService, 
        PrismaService, 
        GoogleMapsService,
        ConfigService,
      ],
    })
    .overrideProvider(LocationsService)
    .useValue(mockLocationService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<LocationsController>(LocationsController);
  })

  it("should be defined", () => {
    expect(controller).toBeDefined();
  })

  it("should define a function to create a location", () => {
    expect(controller.create).toBeDefined()
  })

  it("should create a location", async () => {
    // Error: Status is REQUEST_DENIED. Google has disabled the use of APIs from this API project.

    // const createdLocation = await controller.create(createLocationDto)
    // console.log(createdLocation)
  })

  it("should define a function to create my location", () => {
    expect(controller.createMyLocation).toBeDefined()
  })

  it("should create my location", async () => {
    // Error: Status is REQUEST_DENIED. Google has disabled the use of APIs from this API project.

    // const createdMyLocation = await controller.createMyLocation(req, createMyLocationDto)
    // console.log(createdMyLocation)
  })
})
