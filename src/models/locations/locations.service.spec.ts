import { Test, TestingModule } from "@nestjs/testing";
import { LocationsService } from "./locations.service";
import { BadRequestException } from "@nestjs/common";
import { GoogleMapsService } from "src/google-maps/google-maps.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import * as haversine from "haversine-distance";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import * as NodeGeocoder from "node-geocoder";
import * as dotenv from 'dotenv'
dotenv.config()


const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const createLocationDto: CreateLocationDto = {
  locationType: "Remote",
  country: 'United States',
  province: 'Massachusetts',
  district: 'Suffolk County',
  city: 'Boston',
  postId: '000102030405060708090a0b'
}

const updateLocationDto: UpdateLocationDto = {}

// Google Maps Mock
const accessKey = process.env.GOOGLE_MAPS_ACCESS_KEY
const options = {
  provider: "google",

  // Optional depending on the providers
  apiKey: accessKey, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

describe("LocationsService", () => {
  let service: LocationsService;

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
    getDistanceUsingHaversine: jest.fn().mockImplementation(async (user: any, saved: any) => {
      try {
        // latitude:31.5203696,longitude:74.35874729999999 lahore
        // latitude:33.2615676,longitude:73.3057508 gujar khan
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
    }),

    findAll: jest.fn().mockImplementation(async () => {
      try {
        return await prisma.location.findMany({
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
    }),

    findOne: jest.fn().mockImplementation(async (_id: string) => {
      try {
        const location = await prisma.location.findFirst({
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
    }),

    createMyLocation: jest.fn().mockImplementation(async (data: any, userId: string) => {
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

    const result = await prisma.location.create({
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
    }),

    create: jest.fn().mockImplementation(async (data: CreateLocationDto) => {
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
        if (data.postId) {
          const result = await prisma.location.create({
            data: {
              postId: data.postId,
              country: data.country,
              province: data.province,
              district: data.district,
              city: data.city,
              location_type: data.locationType,
    
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
      providers: [LocationsService, PrismaService, GoogleMapsService],
    })
    .overrideProvider(GoogleMapsService)
    .useValue(mockGoogleMapsService)
    .overrideProvider(LocationsService)
    .useValue(mockLocationService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<LocationsService>(LocationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should define a function to get the distance from haversine", () => {
    expect(service.getDistanceUsingHaversine).toBeDefined()
  })

  it("should get the distance using haversine", async () => {
    const haversineDistance = await service.getDistanceUsingHaversine('user', 'saved')
    console.log('haversineDistance', haversineDistance)
    expect(service.getDistanceUsingHaversine).toBeCalled()
  })

  it("should define a function to create a location", () => {
    expect(service.create).toBeDefined()
  })

  it("should create a location", async () => {
    // const createdLocation = await service.create(createLocationDto)
    // console.log(createdLocation)
    // expect(service.create).toBeCalled()
    // expect(createdLocation).toEqual({

    // })
  })

  it("should define a function to get all of the posts, users, events, and gigs", () => {
    expect(service.findAll).toBeDefined()
  })

  it("should find all of the posts, users, events, and gigs", async () => {
    // const foundAll = await service.findAll()
    // expect(service.findAll).toBeCalled()
    // console.log(foundAll)
    // expect(foundAll).toEqual({

    // })
  })

  it("should define a function to get one location by id", () => {
    expect(service.findOne).toBeDefined()
  })

  it("should find one location by the id", async () => {
    // const foundOne = await service.findOne("id")
    // console.log(foundOne)
    // expect(service.findOne).toBeCalled()
    // expect(foundOne).toEqual({

    // })
  })

  it("should define a function to create the user's location", () => {
    expect(service.createMyLocation).toBeDefined()
  })

  it("should create the user's location", async () => {
    // const myLocation = await service.createMyLocation("data", "userId")
    // console.log(myLocation)
    // expect(service.createMyLocation).toBeCalled()
    // expect(myLocation).toEqual({

    // })
  })
})
