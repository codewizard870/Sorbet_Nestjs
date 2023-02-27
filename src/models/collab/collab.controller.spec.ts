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
  userId: '000102030405060708090a0s',
  wallet_address: '000102030405060708090a0b',
  public_key: '000102030405060708090a0b',
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now())
}

const updateCollabDto: UpdateCollabDto = {}

describe("collabsController", () => {
  let controller: CollabController

  let mockCollabService = {
    create: jest.fn().mockImplementation(async (data: any) => {
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
        const allCollabs = await prisma.collab.findMany({})
        if (allCollabs) {
          return allCollabs
        }
        else {
          console.log("Failed to find all collabs")
          return { message: 'Failed to find all collabs' }
        }
        
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
        })
        if (collab) {
          return collab
        }
        else {
          console.log("Failed to find collab")
          return { message: 'Failed to find collab' }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findByUserId: jest.fn().mockImplementation(async (userId: string) => {
      try {
        const collab = await prisma.collab.findFirst({
          where: { userId: userId},
        })
        if (collab) {
          return collab
        }
        else {
          console.log("Failed to find collab")
          return { message: 'Failed to find collab' }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findByWalletAddress: jest.fn().mockImplementation(async (walletAddress: string) => {
      try {
        const collab = await prisma.collab.findFirst({
          where: { wallet_address: walletAddress},
        })
        if (collab) {
          return collab
        }
        else {
          console.log("Failed to find collab")
          return { message: 'Failed to find collab' }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findByPublicKey: jest.fn().mockImplementation(async (publicKey: string) => {
      try {
        const collab = await prisma.collab.findFirst({
          where: { public_key: publicKey},
        })
        if (collab) {
          return collab
        }
        else {
          console.log("Failed to find collab")
          return { message: 'Failed to find collab' }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    update: jest.fn().mockImplementation(async (id: string, updateCollabDto: any) => {
      try {
        const updatedCollab = await prisma.collab.update({
          where: { id: id },
          data: updateCollabDto
        })
        if (updatedCollab) {
          return { message: `Successfully updated collab` }
        }
        else {
          console.log(`Failed to remove collab ${id}`)
          return { message: `Failed to update collab` }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("Failed to remove collab.")
      }
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
      try {
        const removedCollab = await prisma.collab.delete({
          where: { id: id },
        })
        if (removedCollab) {
          return { message: `Successfully removed collab` }
        }
        else {
          console.log(`Failed to remove collab ${id}`)
          return { message: `Failed to remove collab` }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("Failed to remove collab.")
      }
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
    expect(controller).toBeDefined();
  })

  it("should define a function to create an collab", () => {
    expect(controller.create).toBeDefined()
  })

  it("should create an collab", async () => {
    const createdcollab = await controller.create(createCollabDto)
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
    expect(controller.findAll).toBeDefined()
  })

  let collab: any
  it("should get all of the collabs and return them", async () => {
    const allcollabs = await controller.findAll()
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
    expect(controller.findOne).toBeDefined()
  })

  it("should get one of the collabs by the id and return it", async () => {
    const onecollab = await controller.findOne(collab.id)
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

  it("should define a function to get one collab by the userId", () => {
    expect(controller.findByUserId).toBeDefined()
  })

  it("should get one of the collabs by the userId and return it", async () => {
    const collabByUserId = await controller.findByUserId(collab.userId)
    expect(collabByUserId).toEqual({
      id: expect.any(String),
      collabId: expect.any(String),
      userId: expect.any(String),
      wallet_address: expect.any(String),
      public_key: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it("should define a function to get one collab by the wallet address", () => {
    expect(controller.findByWalletAddress).toBeDefined()
  })

  it("should get one of the collabs by the wallet address and return it", async () => {
    const collabByWalletAddress = await controller.findByWalletAddress(collab.wallet_address)
    expect(collabByWalletAddress).toEqual({
      id: expect.any(String),
      collabId: expect.any(String),
      userId: expect.any(String),
      wallet_address: expect.any(String),
      public_key: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it("should define a function to get one collab by the public key", () => {
    expect(controller.findByPublicKey).toBeDefined()
  })

  it("should get one of the collabs by the public key and return it", async () => {
    const collabByWalletAddress = await controller.findByPublicKey(collab.public_key)
    expect(collabByWalletAddress).toEqual({
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
    const updatedCollab = await controller.update(collab.id, updateCollabDto)
    expect(updatedCollab).toEqual(expect.any(Object))
    expect(updatedCollab).toEqual(
      { message: `Successfully updated collab` }
    )
    const findUpdatedCollab = await controller.findOne(collab.id)
    expect(findUpdatedCollab).toEqual(expect.any(Object))
    expect(findUpdatedCollab).toEqual({
      id: expect.any(String),
      collabId: expect.any(String),
      userId: expect.any(String),
      wallet_address: expect.any(String),
      public_key: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it("should define a function to remove an collab by the id", () => {
    expect(controller.remove).toBeDefined()
  })

  it("should remove an collab by the id", async () => {
    const removedCollab = await controller.remove(collab.id)
    expect(removedCollab).toEqual(expect.any(Object))
    expect(removedCollab).toEqual(
      { message: `Successfully removed collab` }
    )
    const findDeletedPost = await controller.findOne(collab.id)
    expect(findDeletedPost).toEqual(expect.any(Object))
    expect(findDeletedPost).toEqual(
      { message: 'Failed to find collab' }
    )
  })
})
