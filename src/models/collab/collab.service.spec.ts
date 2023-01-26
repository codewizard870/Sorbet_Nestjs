import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CollabService } from "./collab.service";
import { TimezonesService } from "src/timezones/timezones.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateCollabDto } from "./dto/create-collab.dto";
import { UpdateCollabDto } from "./dto/update-collab.dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const createCollabDto: CreateCollabDto = {
  collabId: '000102030405060708090a0b',
  userId: '000102030405060708090a0b',
  wallet_address: '000102030405060708090a0b',
  public_key: '000102030405060708090a0b',
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now())
}

const updateCollabDto: UpdateCollabDto = {}

describe("CollabService", () => {
  let service: CollabService;

  let mockCollabService = {
    create: jest.fn().mockImplementation(async (data: CreateCollabDto) => {
      try {
    
        const result = await prisma.collab.create({
          data: {
            collabId: data.collabId,
            userId: data.userId,
            wallet_address: data.wallet_address,
            public_key: data.public_key,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now())
          },
        });
        if (result) {
          return result;
        } else {
          throw new BadRequestException();
        } 
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findAll: jest.fn().mockImplementation(async () => {
      try {
        return await prisma.collab.findMany({})
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findOne: jest.fn().mockImplementation(async (_id: string) => {
      try {
        const collab = await prisma.collab.findFirst({
          where: { id: _id },
        });
        if (collab) {
          return collab
        }
        else {
          throw BadRequestException
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    update: jest.fn().mockImplementation(async (id: number, updateCollabDto: UpdateCollabDto) => {
      return `This action updates a #${id} collab`;
    }),

    remove: jest.fn().mockImplementation(async (id: number) => {
      return `This action removes a #${id} collab`;
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollabService, PrismaService, TimezonesService],
    })
    .overrideProvider(CollabService)
    .useValue(mockCollabService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<CollabService>(CollabService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  })

  it("should define a function to create an collab", () => {
    expect(service.create).toBeDefined()
  })

  it("should create an collab", async () => {
    const createdcollab = await service.create(createCollabDto)
    expect(service.create).toBeCalled()
    expect(createdcollab).toEqual({
      id: expect.any(String),
      collabId: expect.any(String),
      userId: expect.any(String),
      wallet_address: expect.any(String),
      public_key: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it("should define a function to get all of the collabs", () => {
    expect(service.findAll).toBeDefined()
  })

  let collab: any
  it("should get all of the collabs and return them", async () => {
    const allcollabs = await service.findAll()
    expect(service.findAll).toBeCalled()
    collab = allcollabs[0]
    expect(collab).toEqual({
      id: expect.any(String),
      collabId: expect.any(String),
      userId: expect.any(String),
      wallet_address: expect.any(String),
      public_key: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it("should define a function to get one collab by the id", () => {
    expect(service.findOne).toBeDefined()
  })

  it("should get one of the collabs by the id and return it", async () => {
    const onecollab = await service.findOne(collab.id)
    expect(service.findOne).toBeCalled()
    expect(onecollab).toEqual({
      id: expect.any(String),
      collabId: expect.any(String),
      userId: expect.any(String),
      wallet_address: expect.any(String),
      public_key: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it("should define a function to update an collab by the id", () => {
    expect(service.update).toBeDefined()
  })

  it("should update an collab by the id", async () => {
    const updatedcollab = await service.update(collab.id, updateCollabDto)
    expect(service.update).toBeCalled()
    expect(updatedcollab).toEqual(
      `This action updates a #${collab.id} collab`
    )
  })

  it("should define a function to remove an collab by the id", () => {
    expect(service.remove).toBeDefined()
  })

  it("should remove an collab by the id", async () => {
    const removedcollab = await service.remove(collab.id)
    expect(service.remove).toBeCalled()
    expect(removedcollab).toEqual(
      `This action removes a #${collab.id} collab`
    )
  })
})
