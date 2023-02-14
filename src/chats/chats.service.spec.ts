import { Test, TestingModule } from "@nestjs/testing";
import { ChatsService } from "./chats.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Context, MockContext, createMockContext } from "../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { BadRequestException } from "@nestjs/common";

const prisma = new PrismaClient()

let mockCtx: MockContext
let service: ChatsService;
let ctx: Context

interface CreateChat {
  message: string,
  creatorId: string,
  contactId: string
}

const mockCreateChatDto: CreateChatDto = {
  message: 'hey',
  contactId: '000102030405060708090a0b'
}

const mockUpdateChatDto: UpdateChatDto = {
  message: 'hey'
}

const userId = '000102030405060708090a0b'

describe("ChatsService", () => {

  // Mock Chats Service
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

  // Runs before each test - sets service and creates mock services
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatsService, PrismaService]
    })
    .overrideProvider(ChatsService)
    .useValue(mockChatsService)
    .compile();

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<ChatsService>(ChatsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should define a function to create a chat", async () => {
    expect(service.create).toBeDefined()
  })

  // Creates a chat and posts to the mock database
  let chat: any
  it("should create a chat and return the result", async () => {
    const createdChat = await service.create(mockCreateChatDto, userId)
    expect(service.create).toBeCalled()
    chat = createdChat
    expect(createdChat).toEqual(expect.any(Object))
    expect(createdChat).toEqual({
      id: expect.any(String),
      message: expect.any(String),
      creatorId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      contactId: expect.any(String)
    })
  })

  it("should define a function to get a chat by the contract id", async () => {
    expect(service.getChatByContactId).toBeDefined()
  })

  it("should get a chats by the contact id", async () => {
    const chatByContactId = await service.getChatByContactId(chat.contactId)
    expect(service.getChatByContactId).toBeCalled()
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

  it("should define a function to get a chat by the user id", async () => {
    expect(service.getChatByUserId).toBeDefined()
  })

  it("should get a chat by user id", async () => {
    const chatByUserId = await service.getChatByUserId(chat.creatorId)
    expect(service.getChatByUserId).toBeCalled()
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

  it("should define a function to find one chat by the id", async () => {
    expect(service.findOne).toBeDefined()
  })

  it("should get a chat by the chat's id", async () => {
    const chatById = await service.findOne(chat.id)
    expect(service.findOne).toBeCalled()
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

  it("should define a function to get all the chats", async () => {
    expect(service.getAll).toBeDefined()
  })

  it("should get all of the chats", async () => {
    const allChats = await service.getAll()
    expect(service.getAll).toBeCalled()
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

  it("should define a function to update a chat by the id", () => {
    expect(service.update).toBeDefined()
  })

  it("should update a chat by the id", async () => {
    const updatedChat = await service.update(chat.id, mockUpdateChatDto)
    console.log(updatedChat)
    expect(service.update).toBeCalled()
    expect(updatedChat).toEqual({
      message: "Updated Successfully"
    })
    const isChatUpdated = await service.findOne(chat.id)
    console.log('isChatUpdated', isChatUpdated)
    expect(service.findOne).toBeCalled()
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

  it("should define a function to remove a chat by the id", async () => {
    expect(service.remove).toBeDefined()
  })

  it("should remove a chat by the id", async () => {
    const removedChat = await service.remove(chat.id)
    expect(service.remove).toBeCalled()
    expect(removedChat).toEqual({
      message: "Deleted Successfully"
    })
    const isChatRemoved = await service.findOne(chat.id)
    expect(service.findOne).toBeCalled()
    expect(isChatRemoved).toEqual([])
  })

  it("should define a function to search messages by message text", async () => {
    expect(service.searchMessages).toBeDefined()
  })

  it("should remove a chat by the id", async () => {
    const chats = await service.searchMessages(chat.message)
    expect(service.searchMessages).toBeCalled()
    expect(chats).toEqual(expect.any(Array))
  })
})
