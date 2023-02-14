import { Test, TestingModule } from "@nestjs/testing";
import { ChatsController } from "./chats.controller";
import { ChatsService } from "./chats.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Context, MockContext, createMockContext } from "../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { BadRequestException } from "@nestjs/common";

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
    create: jest.fn().mockImplementation(async (data: CreateChat) => {
      try {
        const result = await prisma.chat.create({
          data: {
            message: data.message,
            creatorId: userId,
            contactId: data.contactId,
          },
        });
        if (result) {
          return result
        } 
        else {
          throw new BadRequestException("result not found")
        }
      } 
      catch (error) {
        console.log(`Error Occured, ${error}`)
        throw new Error("Could not create message")
      }
    }),

    getChatByContactId: jest.fn().mockImplementation(async (id: string) => {
      try {
        const chat = await prisma.chat.findMany({
          where: { contactId: id },
          // include: { contact: true },
        });
        if (chat) {
          return chat;
        } 
        else {
          console.log("contact not found")
          throw new BadRequestException("contact not found");
        }
      } catch (error) {
        console.log(`Error Occured, ${error}`);
        throw new Error("Could not find message by id")
      }
    }),

    getChatByUserId: jest.fn().mockImplementation(async (id: string) => {
      try {
        const chat = await prisma.chat.findMany({
          where: { creatorId: id },
          // include: { contact: true },
        });
        if (chat) {
          return chat;
        } 
        else {
          throw new BadRequestException("chat not found")
        }
      } 
      catch (error) {
        console.log(`Error Occured, ${error}`)
        throw new Error("Could not find chat by userId")
      }
    }),

    findOne: jest.fn().mockImplementation(async (id: string) => {
      try {
        const chat = await prisma.chat.findMany({
          where: { id: id },
          // include: { contact: true },
        });
        if (chat) {
          return chat;
        } 
        else {
          throw new BadRequestException("chat not found");
        }
      } 
      catch (error) {
        console.log(`Error Occured, ${error}`)
        throw new Error("Could not find chat by id")
      }
    }),

    getAll: jest.fn().mockImplementation(async (id: string) => {
      try {
        const allChats = await prisma.chat.findMany({
          // include: { contact: true },
        })
        if (allChats) {
          return allChats
        } 
        else {
          throw new BadRequestException("chats not found")
        }
      } 
      catch (error) {
        console.log(`Error Occured, ${error}`)
        throw new Error("Could not find all chats")
      }
    }),

    update: jest.fn().mockImplementation(async (id: string, data: any) => {
      try {
        const result = await prisma.chat.update({
          where: { id: id },
          data: data,
        })
        if (result) {
          return { message: "Updated Successfully" }
        }
        else {
          console.log('updated chat error', result)
          return { message: "Could not update chat" }
        } 
      } 
      catch (error) {
        console.log(`Error Occured, ${error}`)
        throw new Error("Could not update chat")
      }
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
      try {
        const result = await prisma.chat.delete({
          where: { id: id },
        })
        if (result) {
          return { message: "Deleted Successfully" }
        } 
        else {
          console.log('delete chat error', result)
          return { message: "Something went wrong" }
        }
      } 
      catch (error) {
        console.log(`Error Occured, ${error}`)
        throw new Error("Could not delete chat")
      }
    }),

    searchMessages: jest.fn().mockImplementation(async (text: string) => {
      try {
        const messages = await prisma.chat.findMany({
          where: { message: text }
        })
    
        if (messages.length === 0 || messages.length > 0) {
          return messages
        }
      } 
      catch (error) {
        console.log(`Error Occured, ${error}`)
        throw new Error("Could not search chats")
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

  it("should define a function to search messages by message text", async () => {
    expect(controller.searchMessages).toBeDefined()
  })

  it("should remove a chat by the id", async () => {
    const chats = await controller.searchMessages(chat.message)
    expect(chats).toEqual(expect.any(Array))
    console.log('chats', chats)
  })
})
