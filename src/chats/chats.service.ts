import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";

@Injectable()
export class ChatsService {
  constructor(private prismaService: PrismaService) {}

  async create(data: any, userId: string) {
    try {
      const result = await this.prismaService.chat.create({
        data: {
          message: data.message,
          creatorId: userId,
          contactId: data.contactId,
        },
      })
      if (result) {
        return result
      } 
      else {
        throw new BadRequestException("Result not found")
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getAll() {
    try {
      const allChats = await this.prismaService.chat.findMany({
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
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(id: string) {
    try {
      const chat = await this.prismaService.chat.findMany({
        where: { id: id },
        // include: { contact: true },
      })
      if (chat) {
        return chat
      } 
      else {
        throw new BadRequestException("chat not found");
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getChatByContactId(contactId: string) {
    try {
      const chat = await this.prismaService.chat.findMany({
        where: { contactId: contactId },
        // include: { contact: true },
      })
      if (chat) {
        return chat
      } 
      else {
        console.log("contact not found")
        throw new BadRequestException("contact not found");
      }
    } catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getChatByUserId(creatorId: string) {
    try {
      const chat = await this.prismaService.chat.findMany({
        where: { creatorId: creatorId },
        // include: { contact: true },
      })
      if (chat) {
        return chat
      } 
      else {
        throw new BadRequestException("chat not found")
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async update(id: string, data: any) {
    try {
      const result = await this.prismaService.chat.update({
        where: { id: id },
        data: data,
      })
      if (result) {
        return result
      }
      else {
        throw new BadRequestException("error updating chat")
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async remove(id: string) {
    try {
      const result = await this.prismaService.chat.delete({
        where: { id: id },
      })
      if (result) {
        return { message: "Deleted Successfully" }
      } 
      else {
        throw new BadRequestException("error deleting chat")
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async searchMessages(text: string) {
    try {
      const messages = await this.prismaService.chat.findMany({
        where: { 
          message: {
            contains: text
          } 
        }
      })
  
      if (messages.length === 0 || messages.length > 0) {
        return messages
      }
      else {
        console.log("No messages found")
        return { message: 'No messages found' }
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }
}
