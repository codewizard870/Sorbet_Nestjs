import { Test, TestingModule } from "@nestjs/testing";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { PasswordsService } from "src/utils/passwords/passwords.service";
import { TokensService } from "src/utils/tokens/tokens.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const createPostDto: CreatePostDto = {
  text: 'New Post',
  timestamp: new Date(Date.now()),
  content: 'Blob'
}

const updatePostDto: UpdatePostDto = {}

const req = {user: {email: 'daena@thrivein.io'}}

let mockUsersService = {
  getUserFromEmail: jest.fn().mockImplementation(async (data: CreatePostDto, email: string) => {
    try {
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
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }),
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
      });
      return post;
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }),

  update: jest.fn().mockImplementation(async (id: number, updatePostDto: UpdatePostDto) => {
    return `This action updates a #${id} post`
  }),

  remove: jest.fn().mockImplementation(async (id: number) => {
    return `This action removes a #${id} post`
  }),
}

describe("PostsController", () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsService, 
        PrismaService, 
        UsersService, 
        PasswordsService,
        TokensService
      ],
    })
    .overrideProvider(PostsService)
    .useValue(mockPostsService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<PostsController>(PostsController)
  });

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  it("should define a function to create a post", () => {
    expect(controller.create).toBeDefined()
  })

  let post: any
  it("should create a post", async () => {
    const createdPost = await controller.create(createPostDto, req)
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
    expect(controller.findAll).toBeDefined()
  })

  it("should find all of the posts", async () => {
    const allPosts = await controller.findAll()
    expect(allPosts).toEqual(expect.any(Array))
  })

  it("should define a function to find one post by id", () => {
    expect(controller.findOne).toBeDefined()
  })

  it("should find one post by id", async () => {
    const onePost = await controller.findOne(post.id)
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
    expect(controller.update).toBeDefined()
  })

  it("should update a post by id", async () => {
    const updatedPost = await controller.update(post.id, updatePostDto)
    expect(updatedPost).toEqual("This action updates a #NaN post")
  })

  it("should define a function to remove a post by the id", () => {
    expect(controller.remove).toBeDefined()
  })

  it("should remove a post by id", async () => {
    const removedPost = await controller.remove(post.id)
    expect(removedPost).toEqual("This action removes a #NaN post")
  })
})
