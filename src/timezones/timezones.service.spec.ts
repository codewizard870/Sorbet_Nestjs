import { Test, TestingModule } from "@nestjs/testing";
import { TimezonesService } from "./timezones.service";
import { CreateTimezoneDto } from "./dto/create-timezone.dto";
import { UpdateTimezoneDto } from "./dto/update-timezone.dto";

let createTimezoneDto: CreateTimezoneDto = {}
let updateTimezoneDto: UpdateTimezoneDto = {}

describe("TimezonesService", () => {
  let service: TimezonesService;

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
      providers: [TimezonesService],
    })
    .overrideProvider(TimezonesService)
    .useValue(mockTimezonesService)
    .compile();

    service = module.get<TimezonesService>(TimezonesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should define a function to create a timezone", () => {
    expect(service.create).toBeDefined()
  })

  it("should create a new timezone", async () => {
    const createdTimezone = await service.create(createTimezoneDto)
    expect(service.create).toBeCalled()
    expect(createdTimezone).toEqual(expect.any(Object))
  })

  it("should define a function to convert to Utc", () => {
    expect(service.convertToUtc).toBeDefined()
  })

  it("should convert to utc", async () => {
    const convertedToUtc = await service.convertToUtc(Date.now())
    expect(service.convertToUtc).toBeCalled()
    expect(convertedToUtc).toEqual(expect.any(Date))
  })

  it("should define a function to return all of the timezones", () => {
    expect(service.findAll).toBeDefined()
  })

  it("should find all the timezones", async () => {
    const allTimezones = await service.findAll()
    expect(service.findAll).toBeCalled()
    expect(allTimezones).toEqual(`This action returns all timezones`)
  })

  it("should define a function to find one of the timezones by id", () => {
    expect(service.findOne).toBeDefined()
  })

  it("should find one timezone by the id", async () => {
    const timezone = await service.findOne(1)
    expect(service.findOne).toBeCalled()
    expect(timezone).toEqual(`This action returns a #${1} timezone`)
  })

  it("should define a function to update one of the timezones by id", () => {
    expect(service.update).toBeDefined()
  })

  it("should update one of the timezones by id", async () => {
    const updatedTimezone = await service.update(1, updateTimezoneDto)
    expect(service.update).toBeCalled()
    expect(updatedTimezone).toEqual(`This action updates a #${1} timezone`)
  })

  it("should define a function to remove one of the timezones by id", () => {
    expect(service.remove).toBeDefined()
  })

  it("should remove one of the timezones by id", async () => {
    const removedTimezone = await service.remove(1)
    expect(service.remove).toBeCalled()
    expect(removedTimezone).toEqual(`This action removes a #${1} timezone`)
  })
});
