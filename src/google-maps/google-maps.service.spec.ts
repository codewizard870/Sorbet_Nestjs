import { Test, TestingModule } from "@nestjs/testing";
import { GoogleMapsService } from "./google-maps.service";
import * as NodeGeocoder from "node-geocoder";
import * as dotenv from 'dotenv'
dotenv.config()

const accessKey = process.env.GOOGLE_MAPS_ACCESS_KEY

const options = {
  provider: "google",

  // Optional depending on the providers
  apiKey: accessKey, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

describe("GoogleMapsService", () => {
  let service: GoogleMapsService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleMapsService],
    })
    .overrideProvider(GoogleMapsService)
    .useValue(mockGoogleMapsService)
    .compile()

    service = module.get<GoogleMapsService>(GoogleMapsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should define a function to get the coordinates", () => {
    expect(service.getCoordinates).toBeDefined()
  })

  it("should get the coordinates of a given address", async () => {
    // const coordiantes = await service.getCoordinates("Boston, Massachusetts, United States")
    // expect(service.getCoordinates).toBeCalled()
    // expect(coordiantes).toEqual({
    //   lat: expect.any(String),
    //   lng: expect.any(String)
    // })
  })
})
