import { Test, TestingModule } from "@nestjs/testing";
import { TimezonesController } from "./timezones.controller";
import { TimezonesService } from "./timezones.service";
import { CreateTimezoneDto } from "./dto/create-timezone.dto";
import { UpdateTimezoneDto } from "./dto/update-timezone.dto";

let createTimezoneDto: CreateTimezoneDto = {}
let updateTimezoneDto: UpdateTimezoneDto = {}

describe("TimezonesController", () => {
  let controller: TimezonesController;

  let mockTimezonesService = {
    create: jest.fn().mockImplementation(async (createTimezoneDto: CreateTimezoneDto) => {
      return (createTimezoneDto)
    }),

    convertToUtc: jest.fn().mockImplementation(async (getdate: any) => {
      const date = new Date(getdate)
      var new_utc = new Date(date.toUTCString())
      return new_utc
    }),

    findAll: jest.fn().mockImplementation(async () => {
      return `This action returns all timezones`
    }),

    findOne: jest.fn().mockImplementation(async (id: number) => {
      return `This action returns a #${id} timezone`
    }),

    update: jest.fn().mockImplementation(async (id: number, updateTimezoneDto: UpdateTimezoneDto) => {
      return `This action updates a #${id} timezone`
    }),

    remove: jest.fn().mockImplementation(async (id: number) => {
      return `This action removes a #${id} timezone`
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimezonesController],
      providers: [TimezonesService],
    })
    .overrideProvider(TimezonesService)
    .useValue(mockTimezonesService)
    .compile();

    controller = module.get<TimezonesController>(TimezonesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should define a function to create a timezone", () => {
    expect(controller.create).toBeDefined()
  })

  it("should create a new timezone", async () => {
    const createdTimezone = await controller.create(createTimezoneDto)
    console.log(createdTimezone)
    expect(createdTimezone).toEqual(expect.any(Object))
  })

  it("should define a function to return all of the timezones", () => {
    expect(controller.findAll).toBeDefined()
  })

  it("should find all the timezones", async () => {
    const allTimezones = await controller.findAll()
    expect(allTimezones).toEqual(`This action returns all timezones`)
  })

  it("should define a function to find one of the timezones by id", () => {
    expect(controller.findOne).toBeDefined()
  })

  it("should find one timezone by the id", async () => {
    const timezone = await controller.findOne("1")
    expect(timezone).toEqual(`This action returns a #${"1"} timezone`)
  })

  it("should define a function to update one of the timezones by id", () => {
    expect(controller.update).toBeDefined()
  })

  it("should update one of the timezones by id", async () => {
    const updatedTimezone = await controller.update("1", updateTimezoneDto)
    expect(updatedTimezone).toEqual(`This action updates a #${1} timezone`)
  })

  it("should define a function to remove one of the timezones by id", () => {
    expect(controller.remove).toBeDefined()
  })

  it("should remove one of the timezones by id", async () => {
    const removedTimezone = await controller.remove("1")
    expect(removedTimezone).toEqual(`This action removes a #${"1"} timezone`)
  })
});
