import { Test, TestingModule } from "@nestjs/testing";
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

const createdPostLikeDto: any = {
  createdAt: new Date(Date.now()),
  postId: 'postId'
}

const createdEventLikeDto: any = {
  createdAt: new Date(Date.now()),
  eventId: 'eventId'
}

const createdGigLikeDto: any = {
  createdAt: new Date(Date.now()),
  gigId: 'gigId'
}

const updatedLikeDto: UpdateLikeDto = {
    createdAt: new Date(Date.now())
}

const userId = '000102030405060708090a0b'

describe("LikeController", () => {
  let service: LikeService

  let mockLikeService = {
    createPostLike: jest.fn().mockImplementation(async (data: CreateLikeDto, userId: string) => {
      try {
        const existingLike = await prisma.like.findUnique({
          where: {userId: userId, postId: data.postId},
          include: { post: true }
        })
        if (existingLike) {
          return {
            message: `User: ${userId} has already liked post`,
            existingLike
          }
        }
        else {
          const newLike = await prisma.like.create({
            data: {
              createdAt: data.createdAt,
              userId: userId,
              postId: data.postId
            }
          })
          if (newLike) {
            return newLike
          }
          else {
            console.log(`Error creating post like for user: ${userId}.`)
            return { message: `Error creating post like for user: ${userId}.`}
          }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    createEventLike: jest.fn().mockImplementation(async (data: CreateLikeDto, userId: string) => {
      try {
        const existingLike = await prisma.like.findUnique({
          where: {userId: userId, eventId: data.eventId},
          include: { event: true }
        })
        if (existingLike) {
          return {
            message: `User: ${userId} has already liked event`,
            existingLike
          }
        }
        else {
          const newLike = await prisma.like.create({
            data: {
              createdAt: data.createdAt,
              userId: userId,
              eventId: data.eventId
            }
          })
          if (newLike) {
            return newLike
          }
          else {
            console.log(`Error creating event like for user: ${userId}.`)
            return { message: `Error creating event like for user: ${userId}.`}
          }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    createGigLike: jest.fn().mockImplementation(async (data: CreateLikeDto, userId: string) => {
      try {
        const existingLike = await prisma.like.findUnique({
          where: {userId: userId, eventId: data.eventId},
          include: { event: true }
        })
        if (existingLike) {
          return {
            message: `User: ${userId} has already liked event`,
            existingLike
          }
        }
        else {
          const newLike = await prisma.like.create({
            data: {
              createdAt: data.createdAt,
              userId: userId,
              eventId: data.eventId
            }
          })
          if (newLike) {
            return newLike
          }
          else {
            console.log(`Error creating event like for user: ${userId}.`)
            return { message: `Error creating event like for user: ${userId}.`}
          }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findAllLikesForPost: jest.fn().mockImplementation(async (postId: string) => {
      try {
        const postLikes =  await prisma.like.findMany({
          where: { postId: postId },
          include: { post: true }
        })
        if (postLikes) {
          return postLikes
        }
        else {
          console.log(`Unable to get all likes for post: ${postId}`)
          return { message: `Unable to get all likes for post: ${postId}` }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findAllLikesForEvent: jest.fn().mockImplementation(async (eventId: string) => {
      try {
        const eventLikes = await prisma.like.findMany({
          where: { eventId: eventId },
          include: { event: true }
        })
        if (eventLikes) {
          return eventLikes
        }
        else {
          console.log(`Unable to get all likes for event: ${eventId}`)
          return { message: `Unable to get post likes for event: ${eventId}` }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findAllLikesForGig: jest.fn().mockImplementation(async (gigId: string) => {
      try {
        const gigLikes = await prisma.like.findMany({
          where: { gigId: gigId },
          include: { gig: true }
        })
        if (gigLikes) {
          return gigLikes
        }
        else {
          console.log(`Unable to get all likes for gig: ${gigId}`)
          return { message: `Unable to get post likes for gig: ${gigId}` }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findOne: jest.fn().mockImplementation(async (id: string) => {
      try {
        const like = await prisma.like.findFirst({
          where: { id: id }
        })
        if (like) {
          return like
        }
        else {
          console.log(`Could not find like by id: ${id}`)
          return { message: `Could not find like by id: ${id}` }
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
      providers: [LikeService, PrismaService],
    })
    .overrideProvider(LikeService)
    .useValue(mockLikeService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<LikeService>(LikeService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should define a function to create a like for a post", () => {
    expect(service.createPostLike).toBeDefined()
  })

  let like: any
  it("should create a new like for a post", async () => {
    const createdLike = await service.createPostLike(createdPostLikeDto, userId)
    like = createdLike
    expect(createdLike).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      userId: expect.any(String),
      eventId: null,
      gigId: null,
      postId: expect.any(String)
    })
  })

  it("should define a function to create a like for an event", () => {
    expect(service.createEventLike).toBeDefined()
  })

  it("should create a new like for an event", async () => {
    const createdLike = await service.createEventLike(createdEventLikeDto, userId)
    expect(createdLike).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      userId: expect.any(String),
      eventId: expect.any(String),
      gigId: null,
      postId: null
    })
  })

  it("should define a function to create a like for a gig", () => {
    expect(service.createGigLike).toBeDefined()
  })

  it("should create a new like for a gig", async () => {
    const createdLike = await service.createGigLike(createdGigLikeDto, userId)
    expect(createdLike).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      userId: expect.any(String),
      eventId: null,
      gigId: expect.any(String),
      postId: null
    })
  })

  it("should define a function to find all of the likes for a post", () => {
    expect(service.findAllLikesForPost).toBeDefined()
  })

  it("should find all of the likes for the post", async () => {
    const likes = await service.findAllLikesForPost(like.postId)
    expect(service.findAllLikesForPost).toHaveBeenCalled()
  })

  it("should define a function to find all of the likes for an event", () => {
    expect(service.findAllLikesForEvent).toBeDefined()
  })

  it("should find all of the likes for the event", async () => {
    const likes = await service.findAllLikesForEvent(like.eventId)
    expect(service.findAllLikesForEvent).toHaveBeenCalled()
  })

  it("should define a function to find all of the likes for a gig", () => {
    expect(service.findAllLikesForGig).toBeDefined()
  })

  it("should find all of the likes for the gig", async () => {
    const likes = await service.findAllLikesForGig(like.gigId)
    expect(service.findAllLikesForEvent).toHaveBeenCalled()
  })

  it("should define a function to get one of the likes", () => {
    expect(service.findOne).toBeDefined()
  })

  it("should find a like by id", async () => {
    const oneLike = await service.findOne(like.id)
    expect(service.findOne).toHaveBeenCalled()
    // expect(oneLike).toEqual({

    // })
  })

  it("should define a function to remove a like by id", () => {
    expect(service.removeLike).toBeDefined()
  })

  it("should remove a like id", async () => {
    const removedLike = await service.removeLike(like.id)
    expect(removedLike).toEqual(
      { message: "Deleted Successfully" }
    )
    const findDeletedLike = await service.findOne(like.id)
    expect(findDeletedLike).toEqual(null)
  })
})
