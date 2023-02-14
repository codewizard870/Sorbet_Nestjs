import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";

@Injectable()
export class GroupsService {
  constructor(private prismaService: PrismaService) {}

  async create(data: any, userId: string) {
    try {
      const result = await this.prismaService.group.create({
        data: {
          name: data.name,
          description: data.description,
          image: data.image,
          group_owner: userId,
          userIDs: data.userIDs,
          // members: data.members,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      })
      if (result) {
        return result
      } 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAll() {
    try {
      return await this.prismaService.group.findMany({
        include: { members: true },
      })
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(_id: string) {
    try {
      const group = await this.prismaService.group.findFirst({
        where: { id: _id },
        include: { members: true },
      });
      return group
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async update(id: string, data: UpdateGroupDto) {
    const result = await this.prismaService.group.update({
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
    const result = await this.prismaService.group.delete({
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
