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

const updateCollabDto: UpdateCollabDto = {
  wallet_address: 'abcdefghijklmnopqrstuvwxyz'
}

describe("CollabService", () => {
  let service: CollabService;

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

  it("should define a function to get one collab by the userId", () => {
    expect(service.findByUserId).toBeDefined()
  })

  it("should get one of the collabs by the userId and return it", async () => {
    const collabByUserId = await service.findByUserId(collab.userId)
    expect(service.findByUserId).toBeCalled()
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
    expect(service.findByWalletAddress).toBeDefined()
  })

  it("should get one of the collabs by the wallet address and return it", async () => {
    const collabByWalletAddress = await service.findByWalletAddress(collab.wallet_address)
    expect(service.findByWalletAddress).toBeCalled()
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
    expect(service.findByPublicKey).toBeDefined()
  })

  it("should get one of the collabs by the public key and return it", async () => {
    const collabByWalletAddress = await service.findByPublicKey(collab.public_key)
    expect(service.findByPublicKey).toBeCalled()
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
    expect(service.update).toBeDefined()
  })

  it("should update an collab by the id", async () => {
    const updatedCollab = await service.update(collab.id, updateCollabDto)
    expect(service.update).toBeCalled()
    expect(updatedCollab).toEqual(expect.any(Object))
    expect(updatedCollab).toEqual(
      { message: `Successfully updated collab` }
    )
    const findUpdatedCollab = await service.findOne(collab.id)
    expect(service.findOne).toBeCalled()
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
    expect(service.remove).toBeDefined()
  })

  it("should remove an collab by the id", async () => {
    const removedCollab = await service.remove(collab.id)
    expect(service.remove).toBeCalled()
    expect(removedCollab).toEqual(expect.any(Object))
    expect(removedCollab).toEqual(
      { message: `Successfully removed collab` }
    )
    const findDeletedPost = await service.findOne(collab.id)
    expect(service.remove).toBeCalled()
    expect(findDeletedPost).toEqual(expect.any(Object))
    expect(findDeletedPost).toEqual(
      { message: 'Failed to find collab' }
    )
  })
})
