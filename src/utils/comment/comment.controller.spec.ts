import { Test, TestingModule } from "@nestjs/testing";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment-dto";
import { UpdateCommentDto } from "./dto/update-comment-dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const createdCommentDto: CreateCommentDto = {
  text: 'first comment',
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now())
}

const updatedCommentDto: UpdateCommentDto = {
    createdAt: new Date(Date.now())
}

const userId = '000102030405060708090a0b'

describe("CommentController", () => {
  let controller: CommentController

  let mockCommentService = {
    create: jest.fn().mockImplementation(async (data: CreateCommentDto, userId: string) => {
      try {
        const result = await prisma.comment.create({
          data: {
            text: data.text,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
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
            return await prisma.comment.findMany({
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
            const comment = await prisma.comment.findFirst({
              where: { id: id },
              include: { user: true, event: true, gig: true, post: true },
            })
            return comment
          } 
        catch (error) {
            console.log(error)
            throw new Error("An error occured. Please try again.")
        }
    }),

    update: jest.fn().mockImplementation(async (id: string, data: UpdateCommentDto) => {
        try {
            const result = await prisma.comment.update({
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
            const result = await prisma.comment.delete({
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
      controllers: [CommentController],
      providers: [CommentService, PrismaService],
    })
    .overrideProvider(CommentService)
    .useValue(mockCommentService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<CommentController>(CommentController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  it("should define a function to create a comment", () => {
    expect(controller.create).toBeDefined()
  })

  let comment: any
  it("should create a new comment and post to the database", async () => {
    const createdComment = await controller.create(createdCommentDto, userId)
    console.log('createdComment', createdComment)
    comment = createdComment
    expect(createdComment).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String)
    })
  })

  it("should define a function to find all the comments", () => {
    expect(controller.findAll).toBeDefined()
  })

  it("should find all of the comments and return them", async () => {
    const allComments = await controller.findAll()
    expect(allComments).toEqual(expect.any(Array))
    expect(allComments[0]).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        user: expect.any(Array),
        event: expect.any(Array),
        gig: expect.any(Array),
        post: expect.any(Array)
    })
  })

  it("should define a function to find one comment by id", () => {
    expect(controller.findOne).toBeDefined()
  })

  it("should find one comment and return it", async () => {
    const oneComment = await controller.findOne(comment.id)
    console.log(oneComment)
    expect(oneComment).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        user: expect.any(Array),
        event: expect.any(Array),
        gig: expect.any(Array),
        post: expect.any(Array)
    })
  })

  it("should define a function to update a comment by id", () => {
    expect(controller.update).toBeDefined()
  })

  it("should update a comment by id", async () => {
    const updatedGroup = await controller.update(comment.id, updatedCommentDto)
    expect(updatedGroup).toEqual(
      { message: "Updated Successfully" }
    )
  })

  it("should define a function to remove a comment by id", () => {
    expect(controller.remove).toBeDefined()
  })

  it("should remove a comment id", async () => {
    const removedComment = await controller.remove(comment.id)
    expect(removedComment).toEqual(
      { message: "Deleted Successfully" }
    )
    const findDeletedComment = await controller.findOne(comment.id)
    expect(findDeletedComment).toEqual(null)
  })
})
