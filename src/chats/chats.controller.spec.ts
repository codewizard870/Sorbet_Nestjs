import { Test, TestingModule } from "@nestjs/testing";
import { ChatsController } from "./chats.controller";
import { ChatsService } from "./chats.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Context, MockContext, createMockContext } from "../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CreateChat {
  message: string,
  creatorId: string,
  contactId: string
}

describe("ChatsController", () => {
  let controller: ChatsController;
  let mockCtx: MockContext
  let ctx: Context

  let createChatDto = {
    message: 'hey', 
    contactId: '000102030405060708090a0b'
  }

  let req = {
    user: {
      id: '000102030405060708090a0b'
    }
  }

  const chatData = {
    message: 'hey',
    creatorId: '000102030405060708090a0b',
    contactId: '000102030405060708090a0b'
  }
  const userId = '000102030405060708090a0b'

  let mockChatsService = {
    create: jest.fn().mockImplementation(async (chat: CreateChat) => {
      try {
        const result = await prisma.chat.create({
          data: {
            message: chat.message,
            creatorId: userId,
            contactId: chat.contactId,
          },
        });
        if (result) {
          return result;
        } else {
          throw new Error("result not found");
        }
      } 
      catch (error) {
        console.log(error)
      }
    }),

    getChatByContactId: jest.fn().mockImplementation(async (id: string) => {
      try {
        const chat = await prisma.chat.findMany({
          where: { contactId: id },
        include: { contact: true },
        });
        if (chat) {
          return chat;
        } else {
          throw new Error("contact not found");
        }
      } 
      catch (error) {
        console.log(error)
      }
    }),

    getChatByUserId: jest.fn().mockImplementation(async (id: string) => {
      try {
        const chat = await prisma.chat.findMany({
          where: { creatorId: id },
          include: { contact: true },
        });
        if (chat) {
          return chat;
        } else {
          throw new Error("chat not found");
        }
      } catch (error) {
        console.log(`Error Occured, ${error}`);
      }
    }),

    findOne: jest.fn().mockImplementation(async (id: string) => {
      try {
        const chat = await prisma.chat.findMany({
          where: { id: id },
          include: { contact: true },
        });
        if (chat) {
          return chat;
        } else {
          throw new Error("chat not found");
        }
      } catch (error) {
        console.log(`Error Occured, ${error}`);
      }
    }),

    getAll: jest.fn().mockImplementation(async (id: string) => {
      try {
        const chat = await prisma.chat.findMany({
          include: { contact: true },
        });
        if (chat) {
          return chat;
        } else {
          throw new Error("chat not found");
        }
      } catch (error) {
        console.log(`Error Occured, ${error}`);
      }
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
      const result = await prisma.chat.delete({
        where: { id: id },
      });
      if (result) {
        return { message: "Deleted Successfully" };
      } else {
        return { message: "Something went wrong" };
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsController],
      providers: [ChatsService, PrismaService],
    })
      .overrideProvider(ChatsService)
      .useValue(mockChatsService)
      .compile();

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<ChatsController>(ChatsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  // POST - create
  it("create post request should be defined", async () => {
    expect(controller.create).toBeDefined()
  })

  let createdChat: any
  it("should create a chat and post to the database", async () => {
    createdChat = await controller.create(createChatDto, req)
    expect(createdChat).toEqual({
        id: expect.any(String),
        message: 'hey',
        creatorId: '000102030405060708090a0b',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        contactId: '000102030405060708090a0b'
      })
  })

  // GET - getAll
  it("getAll get request should be defined", () => {
    expect(controller.findAll).toBeDefined()
  })

  it("should get all of the chats and return them in an array", async () => {
    const allChats = await controller.findAll()
    // expect(controller.findAll).toBeCalled()
  })

  // GET - findOne
  it("findOne get request should be defined", () => {
    expect(controller.findOne).toBeDefined()
  })

  it("get a chat by the id and return it", async () => {
    const chat = await controller.findOne(createdChat.id)
    // expect(controller.findOne).toBeCalled()
    // expect(chat).toEqual({
    //   id: expect.any(String),
    //   message: 'hey',
    //   creatorId: '000102030405060708090a0b',
    //   createdAt: expect.any(Date),
    //   updatedAt: expect.any(Date),
    //   contactId: '000102030405060708090a0b'
    // }) 
  })

  it("findBycontactId get request should be defined", () => {
    expect(controller.findBycontactId).toBeDefined()
  })

  it("finds a chat by the contactId and returns it", async () => {
    const chat = await controller.findBycontactId(createdChat.contactId)
    // expect(controller.findBycontactId).toBeCalled()
    // expect(chat).toEqual({
    //   id: expect.any(String),
    //   message: 'hey',
    //   creatorId: '000102030405060708090a0b',
    //   createdAt: expect.any(Date),
    //   updatedAt: expect.any(Date),
    //   contactId: '000102030405060708090a0b'
    // })
  })

  it("findByuserId get request should be defined", () => {
    expect(controller.findByuserId).toBeDefined()
  })

  it("finds a chat by the userId and returns it", async () => {
    const chat = await controller.findByuserId(createdChat.userId)
    // expect(controller.findByuserId).toBeCalled()
    // expect(chat).toEqual({
    //   id: expect.any(String),
    //   message: 'hey',
    //   creatorId: '000102030405060708090a0b',
    //   createdAt: expect.any(Date),
    //   updatedAt: expect.any(Date),
    //   contactId: '000102030405060708090a0b'
    // })
  })

  it("remove delete request should be defined", () => {
    expect(controller.remove).toBeDefined()
  })

  it("removes a chat from the database by id", async () => {
    const removedChat = await controller.remove(createdChat.id)
    expect(removedChat).toEqual({
      message: "Deleted Successfully"
    })
  })
})
