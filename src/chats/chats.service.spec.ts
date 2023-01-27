import { Test, TestingModule } from "@nestjs/testing";
import { ChatsService } from "./chats.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Context, MockContext, createMockContext } from "../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";

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
})
