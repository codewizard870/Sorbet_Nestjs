import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { GigsService } from "./gigs.service";
import { TimezonesService } from "src/timezones/timezones.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreatePostDto } from "../posts/dto/create-post.dto";
import { CreateGigDto } from "./dto/create-gig.dto";
import { UpdateGigDto } from "./dto/update-gig.dto";
import { CreateTimezoneDto } from "src/timezones/dto/create-timezone.dto";
import { UpdateTimezoneDto } from "src/timezones/dto/update-timezone.dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const createGigDto: CreateGigDto = {
  postId: "000102030405060708090a0b",
  timezone: new Date(Date.now()),
  start_date: new Date(Date.now()),
  end_date: new Date(Date.now()),
  title: 'Software Engineer Contract at ThriveIN',
  description: 'ThriveIN is looking for a Fullstack Software Engineer to join their team.',
  gig_price_min: 2000,
  gig_price_max: 5000,
  tags: ['software development', 'web3', 'blockchain', 'NEAR']
}

const updateGigDto: UpdateGigDto = {}

describe("GigsService", () => {
  let service: GigsService;

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

  let mockGigsService = {
    create: jest.fn().mockImplementation(async (data: CreateGigDto) => {
      try {
        const utcStartDate = mockTimezonesService.convertToUtc(data.start_date);
        const utcEndDate = mockTimezonesService.convertToUtc(data.end_date);
        const result = await prisma.gig.create({
          data: {
            postId: data.postId,
            timezone: data.timezone,
            start_date: utcStartDate,
            end_date: utcEndDate,
            title: data.title,
            description: data.description,
            gig_price_min: data.gig_price_min,
            gig_price_max: data.gig_price_max,
            tags: data.tags,
          },
        });
        if (result) {
          return result;
        } 
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findAll: jest.fn().mockImplementation(async () => {
      try {
        return await prisma.gig.findMany({
          include: { location: true },
        })
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findOne: jest.fn().mockImplementation(async (_id: string) => {
      try {
        const gig = await prisma.gig.findFirst({
          where: { id: _id },
          include: { location: true },
        });
        return gig;
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    update: jest.fn().mockImplementation(async (id: number, updateGigDto: UpdateGigDto) => {
      return `This action updates a #${id} gig`
    }),

    remove: jest.fn().mockImplementation(async (id: number) => {
      return `This action removes a #${id} gig`
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GigsService, PrismaService, TimezonesService],
    })
    .overrideProvider(GigsService)
    .useValue(mockGigsService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<GigsService>(GigsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should define a function to create a gig", () => {
    expect(service.create).toBeDefined()
  })

  it("should create a new gig and post to the database", async () => {
    // const createdGig = await service.create(createGigDto)
    // console.log(createdGig)
    // expect(service.create).toBeCalled()
    // expect(createdGig).toEqual({
    //   id: expect.any(String),
    //   timezone: expect.any(Date),
    //   start_date: expect.any(Date),
    //   end_date: expect.any(Date),
    //   title: expect.any(String),
    //   description: expect.any(String),
    //   gig_price_min: expect.any(Number),
    //   gig_price_max: expect.any(Number),
    //   tags: expect.any(Array),
    //   location: expect.any(Array),
    //   post: expect.any(CreatePostDto),
    //   postId: expect.any(String)
    // })
  })

  it("should define a function to find all the gigs", () => {
    expect(service.findAll).toBeDefined()
  })

  it("should find all of the gigs and return them", async () => {
    // const allGigs = await service.findAll()
    // console.log(allGigs)
    // expect(service.findAll).toBeCalled()
    // expect(createdGig).toEqual({
    //   id: expect.any(String),
    //   timezone: expect.any(Date),
    //   start_date: expect.any(Date),
    //   end_date: expect.any(Date),
    //   title: expect.any(String),
    //   description: expect.any(String),
    //   gig_price_min: expect.any(Number),
    //   gig_price_max: expect.any(Number),
    //   tags: expect.any(Array),
    //   location: expect.any(Array),
    //   post: expect.any(CreatePostDto),
    //   postId: expect.any(String)
    // })
  })

  it("should define a function to find one gig by id", () => {
    expect(service.findOne).toBeDefined()
  })

  it("should find one of the gigs and return it", async () => {
    const gig = await service.findOne('000102030405060708090a0b')
    console.log(gig)
    expect(service.findOne).toBeCalled()
    // expect(createdGig).toEqual({
    //   id: expect.any(String),
    //   timezone: expect.any(Date),
    //   start_date: expect.any(Date),
    //   end_date: expect.any(Date),
    //   title: expect.any(String),
    //   description: expect.any(String),
    //   gig_price_min: expect.any(Number),
    //   gig_price_max: expect.any(Number),
    //   tags: expect.any(Array),
    //   location: expect.any(Array),
    //   post: expect.any(CreatePostDto),
    //   postId: expect.any(String)
    // })
  })

  it("should define a function to update a gig by id", () => {
    expect(service.update).toBeDefined()
  })

  it("should update a gig id", async () => {
    const updatedGig = await service.update(1, updateGigDto)
    expect(service.update).toBeCalled()
    expect(updatedGig).toEqual(
      `This action updates a #${1} gig`
    )
  })

  it("should define a function to remove a gig by id", () => {
    expect(service.remove).toBeDefined()
  })

  it("should update a gig id", async () => {
    const removedGig = await service.remove(1)
    expect(service.remove).toBeCalled()
    expect(removedGig).toEqual(
      `This action removes a #${1} gig`
    )
  })
})
