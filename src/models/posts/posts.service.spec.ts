import { Test, TestingModule } from "@nestjs/testing";
import { PostsService } from "./posts.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { PasswordsService } from "src/utils/passwords/passwords.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import { Content } from "@prisma/client";
import { TokensService } from "src/utils/tokens/tokens.service";


const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const createPostDto: CreatePostDto = {
  text: 'New Post',
  timestamp: new Date(Date.now()),
  content: 'Blob'
}

const updatePostDto: UpdatePostDto = {
  text: 'Newer Post'
}

describe("PostsService", () => {
  let service: PostsService;

  let mockUsersService = {
    async getUserFromEmail(email: string) {
      const result = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (result) {
        console.log("RESULT", result);
  
        return result;
      }
    }
  }

  let mockPostsService = {
    create: jest.fn().mockImplementation(async (data: CreatePostDto, email: string) => {
      try {
        const existingUser = await mockUsersService.getUserFromEmail(email);
        if (data.content === "Gig" || data.content === "Event") {
          const result = await prisma.post.create({
            data: {
              timestamp: data.timestamp,
              content: data.content,
              userId: existingUser.id,
            },
          });
          if (result) {
            return result;
          }
        } else {
          const result = await prisma.post.create({
            data: {
              timestamp: data.timestamp,
              text: data.text,
              content: data.content,
              userId: existingUser.id,
            },
          });
          if (result) {
            return result;
          }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findAll: jest.fn().mockImplementation(async () => {
      try {
        return await prisma.post.findMany({
          include: {
            blob: true,
            location: true,
            gig: true,
            event: true,
          },
        });
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findOne: jest.fn().mockImplementation(async (_id: string) => {
      try {
        const post = await prisma.post.findFirst({
          where: { id: _id },
          include: {
            blob: true,
            location: true,
            gig: true,
            event: true,
          },
        })
        if (post) {
          return post
        }
        else {
          console.log("Failed to find post.")
          return { message: "Failed to find post." }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findByUserId: jest.fn().mockImplementation(async (userId: string) => {
      try {
        const post = await prisma.post.findFirst({
          where: { userId: userId },
          include: {
            blob: true,
            location: true,
            gig: true,
            event: true,
          },
        })
        if (post) {
          return post
        }
        else {
          console.log("Could not find post.")
          throw new Error("Could not find post.")
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    update: jest.fn().mockImplementation(async (id: string, updatePostDto: UpdatePostDto) => {
      try {
        const updatedPost = await prisma.post.update({
          where: { id: id },
          data: updatePostDto
        })
        if (updatedPost) {
          return { message: `Successfully updated post` }
        }
        else {
          console.log(`Failed to update post ${id}`)
          return { message: `Failed to update post` }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("Failed to remove post.")
      }
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
      try {
        const removedPost = await prisma.post.delete({
          where: { id: id },
        })
        if (removedPost) {
          return { message: `Successfully removed post` }
        }
        else {
          console.log(`Failed to remove post ${id}`)
          return { message: `Failed to remove post` }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("Failed to remove post.")
      }
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
         UsersService, 
         PrismaService,
         PasswordsService,
         TokensService
      ],
    })
    .overrideProvider(PostsService)
    .useValue(mockPostsService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<PostsService>(PostsService);
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should define a function to create a post", () => {
    expect(service.create).toBeDefined()
  })

  let post: any
  it("should create a post", async () => {
    const createdPost = await service.create(createPostDto, 'daena@thrivein.io')
    post = createdPost
    if(createPostDto.content == 'Gig' || createPostDto.content == 'Event') {
      expect(createdPost).toEqual({
        id: expect.any(String),
        timestamp: expect.any(Date),
        text: null,
        content: expect.any(String),
        userId: expect.any(String)
      })
    }
    else {
      expect(createdPost).toEqual({
        id: expect.any(String),
        timestamp: expect.any(Date),
        text: expect.any(String),
        content: expect.any(String),
        userId: expect.any(String)
      })
    }
  })

  it("should define a function to find all of the posts", () => {
    expect(service.findAll).toBeDefined()
  })

  it("should find all of the posts", async () => {
    const allPosts = await service.findAll()
    expect(allPosts).toEqual(expect.any(Array))
  })

  it("should define a function to find one post by id", () => {
    expect(service.findOne).toBeDefined()
  })

  it("should find one post by id", async () => {
    const onePost = await service.findOne(post.id)
    expect(onePost).toEqual({
      id: expect.any(String),
      timestamp: expect.any(Date),
      text: expect.any(String),
      content: expect.any(String),
      userId: expect.any(String),
      blob: expect.any(Array),
      location: expect.any(Array),
      gig: expect.any(Array),
      event: expect.any(Array)
    })
  })

  it("should define a function to update a post by the id", () => {
    expect(service.update).toBeDefined()
  })

  it("should update a post by id", async () => {
    const updatedPost = await service.update(post.id, updatePostDto)
    expect(service.update).toBeCalled()
    expect(updatedPost).toEqual(expect.any(Object))
    expect(updatedPost).toEqual(
      { message: `Successfully updated post` }
    )
    const findUpdatedPost = await service.findOne(post.id)
    expect(service.findOne).toBeCalled()
    expect(findUpdatedPost).toEqual(expect.any(Object))
    expect(findUpdatedPost).toEqual({
      id: expect.any(String),
      timestamp: expect.any(Date),
      text: updatePostDto.text,
      content: expect.any(String),
      userId: expect.any(String),
      blob: expect.any(Array),
      location: expect.any(Array),
      gig: expect.any(Array),
      event: expect.any(Array)
    })
  })

  it("should define a function to remove a post by the id", () => {
    expect(service.remove).toBeDefined()
  })

  it("should remove a post by id", async () => {
    const removedPost = await service.remove(post.id)
    expect(service.remove).toBeCalled()
    expect(removedPost).toEqual(expect.any(Object))
    expect(removedPost).toEqual(
      { message: `Successfully removed post` }
    )
    const findDeletedPost = await service.findOne(post.id)
    expect(service.remove).toBeCalled()
    expect(findDeletedPost).toEqual(expect.any(Object))
    expect(findDeletedPost).toEqual(
      { message: 'Failed to find post.' }
    )
  })
})
