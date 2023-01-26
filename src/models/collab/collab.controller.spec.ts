import { Test, TestingModule } from "@nestjs/testing";
import { CollabController } from "./collab.controller";
import { CollabService } from "./collab.service";
import { BadRequestException } from "@nestjs/common";
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

describe("collabsController", () => {
  let controller: CollabController

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
        return await prisma.collab.findMany({
        })
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
        return collab
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    update: jest.fn().mockImplementation(async (id: string, updateCollabDto: UpdateCollabDto) => {
      return `This action updates a #${id} collab`;
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
      return `This action removes a #${id} collab`;
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollabController],
      providers: [CollabService, PrismaService],
    })
    .overrideProvider(CollabService)
    .useValue(mockCollabService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<CollabController>(CollabController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  it("should define a function to create an collab", () => {
    expect(controller.create).toBeDefined()
  })

  it("should define a function to create an collab", () => {
    expect(controller.create).toBeDefined()
  })

  it("should create an collab", async () => {
    const createdCollab = await controller.create(createCollabDto)
    console.log(createdCollab)
    expect(createdCollab).toEqual({
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
    expect(controller.findAll).toBeDefined()
  })

  let collab: any
  it("should get all of the collabs and return them", async () => {
    const allCollabs = await controller.findAll()
    collab = allCollabs[0]
    console.log(allCollabs)
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
    expect(controller.findOne).toBeDefined()
  })

  it("should get one of the collabs by the id and return it", async () => {
    const oneCollab = await controller.findOne(collab.id)
    console.log(oneCollab)
    expect(oneCollab).toEqual({
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
    expect(controller.update).toBeDefined()
  })

  it("should update an collab by the id", async () => {
    const updatedCollab = await controller.update(collab.collabId, updateCollabDto)
    expect(updatedCollab).toEqual(
      `This action updates a #${collab.collabId} collab`
    )
  })

  it("should define a function to remove an collab by the id", () => {
    expect(controller.remove).toBeDefined()
  })

  it("should remove an collab by the id", async () => {
    console.log('collab', collab)
    const removedCollab = await controller.remove(collab.id)
    expect(removedCollab).toEqual(
      `This action removes a #${collab.id} collab`
    )
  })
})
