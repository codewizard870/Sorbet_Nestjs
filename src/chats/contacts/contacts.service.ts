import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";

@Injectable()
export class ContactsService {
  constructor(private prismaService: PrismaService) { }

  async create(data: CreateContactDto) {
    try {
      const userIdCheck = await this.prismaService.contact.findFirst({
        where: {
          OR: [
            { userId: data.userId, contacted_userId: data.contacted_userId },
            { userId: data.contacted_userId, contacted_userId: data.userId }
          ]
        }
      })
      if (userIdCheck) {
        console.log(`User ${data.contacted_userId} is already contact with ${data.userId}`)
        throw new Error(`User ${data.contacted_userId} is already contact with ${data.userId}`)
      }
      const result = await this.prismaService.contact.create({
        data: {
          userId: data.userId,
          contacted_userId: data.contacted_userId,
        },
      })
      if (result) {
        return result
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getContactByContactId(id: string) {
    try {
      const contact = await this.prismaService.contact.findFirst({
        where: { id: id },
        include: { chat: true, user: true, contacted_user: true },
      });
      if (contact) {
        return contact
      }
      else {
        throw new BadRequestException("contact not found");
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getContactByUserId(id: string) {
    try {
      const contact = await this.prismaService.contact.findMany({
        where: {
          OR: [{ userId: id }, { contacted_userId: id }],
          NOT: [
            { contacted_user: null }
          ]
        },
        include: { chat: true, user: true, contacted_user: true },
      })

      if (contact) {
        return contact;
      }
      else {
        throw new BadRequestException("contact not found");
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getContactByContactedUserId(id: string) {
    try {
      const contact = await this.prismaService.contact.findMany({
        where: { contacted_userId: id },
        include: { chat: true },
      })
      if (contact) {
        return contact
      }
      else {
        throw new BadRequestException("contact not found");
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getAll() {
    try {
      const contacts = await this.prismaService.contact.findMany({
        include: { chat: true },
      })
      if (contacts) {
        return contacts
      }
      else {
        throw new BadRequestException("contacts not found")
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async remove(id: string) {
    try {
      const result = await this.prismaService.contact.delete({
        where: { id: id },
      })
      if (result) {
        return { message: "deleted Successfully" };
      }
      else {
        return { message: "Something went wrong" };
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }
}
