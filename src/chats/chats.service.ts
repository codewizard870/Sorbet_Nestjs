import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { Prisma } from "@prisma/client";

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
      } else {
        throw new BadRequestException("result not found");
      }
    } 
    catch (error) {
      console.log(`Error Occured, ${error}`)
    }
  }

  async getChatByContactId(id: string) {
    try {
      const chat = await this.prismaService.chat.findMany({
        where: { contactId: id },
        include: { contact: true },
      });
      console.log("chat", chat);
      if (chat) {
        return chat;
      } else {
        throw new BadRequestException("contact not found");
      }
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  }

  async getChatByUserId(id: string) {
    try {
      const chat = await this.prismaService.chat.findMany({
        where: { creatorId: id },
        include: { contact: true },
      });
      if (chat) {
        return chat;
      } 
      else {
        throw new BadRequestException("chat not found");
      }
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  }

  async findOne(id: string) {
    try {
      const chat = await this.prismaService.chat.findMany({
        where: { id: id },
        include: { contact: true },
      });
      console.log("chat", chat);
      if (chat) {
        return chat;
      } 
      else {
        throw new BadRequestException("chat not found");
      }
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  }

  async getAll() {
    try {
      const chat = await this.prismaService.chat.findMany({
        include: { contact: true },
      });
      if (chat) {
        return chat;
      } 
      else {
        throw new BadRequestException("chat not found");
      }
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  }

  async update(id: string, data: any) {
    const result = await this.prismaService.chat.update({
      where: { id: id },
      data: data,
    })
    if (result) {
      return { message: "Updated Successfully" }
    }
    else {
      return { message: "Something went wrong" }
    }
   }

  async remove(id: string) {
    const result = await this.prismaService.chat.delete({
      where: { id: id },
    })
    if (result) {
      return { message: "Deleted Successfully" };
    } 
    else {
      return { message: "Something went wrong" };
    }
  }
}
