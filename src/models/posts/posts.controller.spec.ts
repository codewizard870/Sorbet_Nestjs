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

const data: any = {
  title: "String",
  description: "String",
  imageUrl: "String",
  videoUrl: "String",
  serviceType: "Remote",
  category: "String",
  subCategory: "String",
  seachTags: [],
  salary: "String",
  start_date: new Date(),
  end_date: new Date(),
  startDate: new Date(),
  endDate: new Date(),
  startTime: "String",
  endTime: "String",
  venue: "String",
  externalLink: "String",
  postType: "Post",
  userId: "userId"
};

const createPostDto: CreatePostDto = data;

const updatePostDto: UpdatePostDto = {
  title: 'Newer Post'
}

const req = { user: { email: 'daena@thrivein.io' } }

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
  create: jest.fn().mockImplementation(async (data: CreatePostDto, userId: string) => {
    try {
      const existingUser = await mockUsersService.getUserFromEmail(userId);
      const result = await prisma.post.create({
        data: {
          title: data.title,
          createdAt: new Date(Date.now()),
          description: data.description,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          serviceType: data.serviceType,
          category: data.category,
          subCategory: data.subCategory,
          seachTags: data.seachTags,
          salary: data.salary,
          startDate: data.startDate,
          endDate: data.endDate,
          startTime: data.startTime,
          endTime: data.endTime,
          venue: data.venue,
          externalLink: data.externalLink,
          postType: data.postType,
          userId: existingUser.id
        },
      });
      if (result) {
        return result;
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
          location: true,
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
          location: true,
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
          location: true,
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
    const createdPost = await controller.create(createPostDto)

    expect(createdPost).toEqual({
      id: expect.any(String),
      timestamp: expect.any(Date),
      text: expect.any(String),
      content: expect.any(String),
      userId: expect.any(String)
    })

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
      title: expect.any(String),
      content: expect.any(String),
      userId: expect.any(String),
      location: expect.any(Array),
    })
  })

  it("should define a function to update a post by the id", () => {
    expect(controller.update).toBeDefined()
  })

  it("should update a post by id", async () => {
    const updatedPost = await controller.update(post.id, updatePostDto)
    expect(updatedPost).toEqual(expect.any(Object))
    expect(updatedPost).toEqual(
      { message: `Successfully updated post` }
    )
    const findUpdatedPost = await controller.findOne(post.id)
    expect(findUpdatedPost).toEqual(expect.any(Object))
    expect(findUpdatedPost).toEqual({
      id: expect.any(String),
      timestamp: expect.any(Date),
      title: expect.any(String),
      content: expect.any(String),
      userId: expect.any(String),
      location: expect.any(Array),
    })
  })

  it("should define a function to remove a post by the id", () => {
    expect(controller.remove).toBeDefined()
  })

  it("should remove a post by id", async () => {
    const removedPost = await controller.remove(post.id)
    expect(removedPost).toEqual(expect.any(Object))
    expect(removedPost).toEqual(
      { message: `Successfully removed post` }
    )
    const findDeletedPost = await controller.findOne(post.id)
    expect(findDeletedPost).toEqual(expect.any(Object))
    expect(findDeletedPost).toEqual(
      { message: 'Failed to find post.' }
    )
  })
})
