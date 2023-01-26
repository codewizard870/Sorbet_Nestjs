import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CreateChat {
    message: string,
    creatorId: string,
    contactId: string
}

const userId = "000102030405060708090a0b"
  
export const mockChatsService = {
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