import { Test, TestingModule } from "@nestjs/testing";
import { GigsController } from "./gigs.controller";
import { GigsService } from "./gigs.service";
import { BadRequestException } from "@nestjs/common";
import { TimezonesService } from "src/timezones/timezones.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
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

const updateGigDto: UpdateGigDto = {
  title: 'Software Developer Contract at ThriveIN',
  description: 'ThriveIN is looking for a Fullstack Software Develoepr to join their team.',
}

describe("GigsController", () => {
  let controller: GigsController;

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
        // const utcStartDate = mockTimezonesService.convertToUtc(data.start_date);
        // const utcEndDate = mockTimezonesService.convertToUtc(data.end_date);
        const result = await prisma.gig.create({
          data: {
            postId: data.postId,
            timezone: data.timezone,
            start_date: data.start_date,
            end_date: data.end_date,
            title: data.title,
            description: data.description,
            gig_price_min: data.gig_price_min,
            gig_price_max: data.gig_price_max,
            tags: data.tags,
          },
        });
        if (result) {
          return result
        } 
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findAll: jest.fn().mockImplementation(async () => {
      try {
        const allGigs = await prisma.gig.findMany({
          include: { location: true },
        })
        if (allGigs) {
          return allGigs
        }
        else {
          console.log("Failed to find all gigs")
          return { message: 'Failed to find all gigs' }
        }
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
        })
        if (gig) {
          return gig
        }
        else {
          console.log("Failed to find gig")
          return { message: 'Failed to find gig' }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    update: jest.fn().mockImplementation(async (id: string, updateGigDto: UpdateGigDto) => {
      try {
        const updatedGig = await prisma.gig.update({
          where: { id: id },
          data: updateGigDto
        })
        if (updatedGig) {
          return { message: `Successfully updated gig` }
        }
        else {
          console.log(`Failed to update gig ${id}`)
          return { message: `Failed to update gig` }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("Failed to update gig.")
      }
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
      try {
        const removedGig = await prisma.gig.delete({
          where: { id: id },
        })
        if (removedGig) {
          return { message: `Successfully removed gig` }
        }
        else {
          console.log(`Failed to remove gig ${id}`)
          return { message: `Failed to remove gig` }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("Failed to remove gig.")
      }
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GigsController],
      providers: [GigsService, PrismaService, TimezonesService],
    })
    .overrideProvider(GigsService)
    .useValue(mockGigsService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<GigsController>(GigsController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  it("should define a function to create a gig", () => {
    expect(controller.create).toBeDefined()
  })

  let newGig: any
  it("should create a new gig and post to the database", async () => {
    const createdGig = await controller.create(createGigDto)
    newGig = createdGig
    expect(createdGig).toEqual({
      id: expect.any(String),
      timezone: expect.any(Date),
      start_date: expect.any(Date),
      end_date: expect.any(Date),
      title: expect.any(String),
      description: expect.any(String),
      gig_price_min: expect.any(Number),
      gig_price_max: expect.any(Number),
      tags: expect.any(Array),
      postId: expect.any(String),
    })
  })

  it("should define a function to find all the gigs", () => {
    expect(controller.findAll).toBeDefined()
  })

  it("should find all of the gigs and return them", async () => {
    const allGigs = await controller.findAll()
    expect(allGigs).toEqual(expect.any(Array))
    expect(allGigs[0]).toEqual({
      id: expect.any(String),
      timezone: expect.any(Date),
      start_date: expect.any(Date),
      end_date: expect.any(Date),
      location: expect.any(Array),
      title: expect.any(String),
      description: expect.any(String),
      gig_price_min: expect.any(Number),
      gig_price_max: expect.any(Number),
      tags: expect.any(Array),
      postId: expect.any(String)
    })
  })

  it("should define a function to find one gig by id", () => {
    expect(controller.findOne).toBeDefined()
  })

  it("should find one of the gigs and return it", async () => {
    const gig = await controller.findOne(newGig.id)
    expect(gig).toEqual({
      id: expect.any(String),
      timezone: expect.any(Date),
      start_date: expect.any(Date),
      end_date: expect.any(Date),
      location: expect.any(Array),
      title: expect.any(String),
      description: expect.any(String),
      gig_price_min: expect.any(Number),
      gig_price_max: expect.any(Number),
      tags: expect.any(Array),
      postId: expect.any(String)
    })
  })

  it("should define a function to update a gig by id", () => {
    expect(controller.update).toBeDefined()
  })

  it("should update a gig by id", async () => {
    const updatedGig = await controller.update(newGig.id, updateGigDto)
    expect(updatedGig).toEqual(expect.any(Object))
    expect(updatedGig).toEqual(
      { message: `Successfully updated gig` }
    )
    const findUpdatedGig = await controller.findOne(newGig.id)
    expect(findUpdatedGig).toEqual(expect.any(Object))
    expect(findUpdatedGig).toEqual({
      id: expect.any(String),
      timezone: expect.any(Date),
      start_date: expect.any(Date),
      end_date: expect.any(Date),
      location: expect.any(Array),
      title: updateGigDto.title,
      description: updateGigDto.description,
      gig_price_min: expect.any(Number),
      gig_price_max: expect.any(Number),
      tags: expect.any(Array),
      postId: expect.any(String)
    })
  })

  it("should define a function to remove a gig by id", () => {
    expect(controller.remove).toBeDefined()
  })

  it("should remove a gig by id", async () => {
    const removedGig = await controller.remove(newGig.id)
    expect(removedGig).toEqual(expect.any(Object))
    expect(removedGig).toEqual(
      { message: `Successfully removed gig` }
    )
    const findDeletedGig = await controller.findOne(newGig.id)
    expect(findDeletedGig).toEqual(expect.any(Object))
    expect(findDeletedGig).toEqual(
      { message: 'Failed to find gig' }
    )
  })
})
