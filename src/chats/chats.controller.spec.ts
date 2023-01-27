import { Test, TestingModule } from "@nestjs/testing";
import { ChatsController } from "./chats.controller";
import { ChatsService } from "./chats.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Context, MockContext, createMockContext } from "../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";


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

  const mockCreateChatDto: CreateChatDto = {
    message: 'hey',
    contactId: '000102030405060708090a0b'
  }

  const mockUpdateChatDto: UpdateChatDto = {
    message: 'hey'
  }

  let req = {
    user: {
      id: '000102030405060708090a0b'
    }
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
        })
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
          // include: { contact: true },
        })
        if (chat) {
          return chat;
        } 
        else {
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
          // include: { contact: true },
        })
        if (chat) {
          return chat;
        } 
        else {
          throw new Error("chat not found");
        }
      } 
      catch (error) {
        console.log(`Error Occured, ${error}`);
      }
    }),

    findOne: jest.fn().mockImplementation(async (id: string) => {
      console.log("id", id);

      try {
        const chat = await prisma.chat.findMany({
          where: { id: id },
          // include: { contact: true },
        })
        if (chat) {
          return chat;
        } 
        else {
          throw new Error("chat not found");
        }
      } 
      catch (error) {
        console.log(`Error Occured, ${error}`);
      }
    }),

    getAll: jest.fn().mockImplementation(async (id: string) => {
      try {
        const chat = await prisma.chat.findMany({
          // include: { contact: true },
        })
        if (chat) {
          return chat;
        } 
        else {
          throw new Error("chat not found");
        }
      } 
      catch (error) {
        console.log(`Error Occured, ${error}`);
      }
    }),

    update: jest.fn().mockImplementation(async (id: string, data: any) => {
      const result = await prisma.chat.update({
        where: { id: id },
        data: data,
      })
      if (result) {
        return { message: "Updated Successfully" }
      }
      else {
        return { message: "Something went wrong" }
      }
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
      const result = await prisma.chat.delete({
        where: { id: id },
      })
      if (result) {
        return { message: "Deleted Successfully" };
      } 
      else {
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

  let chat: any
  it("should create a chat and post to the database", async () => {
    const createdChat = await controller.create(mockCreateChatDto, req)
    chat = createdChat
    expect(createdChat).toEqual({
      id: expect.any(String),
      message: expect.any(String),
      creatorId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      contactId: expect.any(String)
    })
  })

  it("getAll get request should be defined", () => {
    expect(controller.findAll).toBeDefined()
  })

  it("should get all of the chats and return them in an array", async () => {
    const allChats = await controller.findAll()
    expect(allChats).toEqual(expect.any(Array))
    expect(allChats[0]).toEqual({
      id: expect.any(String),
      message: expect.any(String),
      creatorId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      contactId: expect.any(String)
    })
  })

  it("findOne get request should be defined", () => {
    expect(controller.findOne).toBeDefined()
  })

  it("get a chat by the id and return it", async () => {
    const chatById = await controller.findOne(chat.id)
    expect(chatById).toEqual(expect.any(Array))
    expect(chatById[0]).toEqual({
      id: expect.any(String),
      message: expect.any(String),
      creatorId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      contactId: expect.any(String)
    }) 
  })

  it("findBycontactId get request should be defined", () => {
    expect(controller.findByContactId).toBeDefined()
  })

  it("finds a chat by the contactId and returns it", async () => {
    const chatByContactId = await controller.findByContactId(chat.contactId)
    expect(chatByContactId).toEqual(expect.any(Array))
    expect(chatByContactId[0]).toEqual({
      id: expect.any(String),
      message: expect.any(String),
      creatorId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      contactId: expect.any(String)
    })
  })

  it("findByuserId get request should be defined", () => {
    expect(controller.findByUserId).toBeDefined()
  })

  it("finds a chat by the userId and returns it", async () => {
    const chatByUserId = await controller.findByUserId(chat.creatorId)
    expect(chatByUserId).toEqual(expect.any(Array))
    expect(chatByUserId[0]).toEqual({
      id: expect.any(String),
      message: expect.any(String),
      creatorId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      contactId: expect.any(String)
    })
  })

  it("should define a function to update a chat by the id", () => {
    expect(controller.update).toBeDefined()
  })

  it("should update a chat by the id", async () => {
    const updatedChat = await controller.update(chat.id, mockUpdateChatDto)
    expect(updatedChat).toEqual({
      message: "Updated Successfully"
    })
    const isChatUpdated = await controller.findOne(chat.id)
    expect(isChatUpdated).toEqual(expect.any(Array))
    expect(isChatUpdated[0]).toEqual({
      id: expect.any(String),
      message: mockUpdateChatDto.message,
      creatorId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      contactId: expect.any(String)
    })
  })

  it("remove delete request should be defined", () => {
    expect(controller.remove).toBeDefined()
  })

  it("removes a chat from the database by id", async () => {
    const removedChat = await controller.remove(chat.id)
    expect(removedChat).toEqual({
      message: "Deleted Successfully"
    })
    const isChatRemoved = await controller.findOne(chat.id)
    expect(isChatRemoved).toEqual([])
  })
})
