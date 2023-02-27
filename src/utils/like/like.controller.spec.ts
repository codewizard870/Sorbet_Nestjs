import { Test, TestingModule } from "@nestjs/testing";
import { LikeController } from "./like.controller";
import { LikeService } from "./like.service";
import { BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateLikeDto } from "./dto/create-like-dto";
import { UpdateLikeDto } from "./dto/update-like-dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const createdLikeDto: CreateLikeDto = {
    createdAt: new Date(Date.now()),
}

const updatedLikeDto: UpdateLikeDto = {
    createdAt: new Date(Date.now())
}

const userId = '000102030405060708090a0b'

describe("LikeController", () => {
  let controller: LikeController

  let mockLikeService = {
    create: jest.fn().mockImplementation(async (data: CreateLikeDto, userId: string) => {
        try {
            const result = await prisma.like.create({
              data: {
                createdAt: data.createdAt,
                userId: userId
              }
            })
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
            return await prisma.like.findMany({
              include: { user: true, event: true, gig: true, post: true },
            })
          } 
          catch (error) {
            console.log(error)
            throw new Error("An error occured. Please try again.")
          }
    }),

    findOne: jest.fn().mockImplementation(async (id: string) => {
        try {
            const like = await prisma.like.findFirst({
              where: { id: id },
              include: { user: true, event: true, gig: true, post: true },
            })
            return like
          } 
        catch (error) {
            console.log(error)
            throw new Error("An error occured. Please try again.")
        }
    }),

    update: jest.fn().mockImplementation(async (id: string, data: UpdateLikeDto) => {
        try {
            const result = await prisma.like.update({
              where: { id: id },
              data: data,
            })
            if (result) {
              return { message: "Updated Successfully" }
            }
            else {
              return { message: "Something went wrong" }
            } 
        } 
        catch (error) {
            console.log(error)
            throw new Error("An error occured. Please try again.")
        }
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
        try {
            const result = await prisma.like.delete({
                where: { id: id },
            })
            if (result) {
                return { message: "Deleted Successfully" };
            } 
            else {
                return { message: "Something went wrong" };
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
      controllers: [LikeController],
      providers: [LikeService, PrismaService],
    })
    .overrideProvider(LikeService)
    .useValue(mockLikeService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<LikeController>(LikeController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  it("should define a function to create a like", () => {
    expect(controller.create).toBeDefined()
  })

  let like: any
  it("should create a new like and post to the database", async () => {
    const createdLike = await controller.create(createdLikeDto, userId)
    console.log('createdLike', createdLike)
    like = createdLike
    expect(createdLike).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String)
    })
  })

  it("should define a function to find all the likes", () => {
    expect(controller.findAll).toBeDefined()
  })

  it("should find all of the likes and return them", async () => {
    const allLikes = await controller.findAll()
    expect(allLikes).toEqual(expect.any(Array))
    expect(allLikes[0]).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        user: expect.any(Array),
        event: expect.any(Array),
        gig: expect.any(Array),
        post: expect.any(Array)
    })
  })

  it("should define a function to find one like by id", () => {
    expect(controller.findOne).toBeDefined()
  })

  it("should find one like and return it", async () => {
    const oneLike = await controller.findOne(like.id)
    console.log(oneLike)
    expect(oneLike).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        user: expect.any(Array),
        event: expect.any(Array),
        gig: expect.any(Array),
        post: expect.any(Array)
    })
  })

  it("should define a function to update a like by id", () => {
    expect(controller.update).toBeDefined()
  })

  it("should update a like by id", async () => {
    const updatedGroup = await controller.update(like.id, updatedLikeDto)
    expect(updatedGroup).toEqual(
      { message: "Updated Successfully" }
    )
  })

  it("should define a function to remove a like by id", () => {
    expect(controller.remove).toBeDefined()
  })

  it("should remove a like id", async () => {
    const removedLike = await controller.remove(like.id)
    expect(removedLike).toEqual(
      { message: "Deleted Successfully" }
    )
    const findDeletedLike = await controller.findOne(like.id)
    expect(findDeletedLike).toEqual(null)
  })
})
