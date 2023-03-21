import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "src/models/users/users.service";
import { CreateFollowDto } from "./dto/create-follow-dto";
import { UpdateFollowDto } from "./dto/update-follow-dto";

@Injectable()
export class FollowService {
  constructor(
    private prismaService: PrismaService, 
    private usersService: UsersService
    ) {}

  async createFollow(data: CreateFollowDto) {
    try {
      const user = await this.prismaService.follow.findFirst({
        where: { fromUserId: data.fromUserId, toUserId: data.toUserId }
      })
      if (user) {
        console.log("Failed to update user or userToFollow")
        return { message: `already followed from ${data.fromUserId} to ${data.toUserId}` }
      }
      const newFollow = await this.prismaService.follow.create({
        data: {
          fromUserId: data.fromUserId,
          toUserId: data.toUserId,
          toPostId: data.toPostId
        }
      })
      if (newFollow) {
        return newFollow
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllFollows() {
    try {
      const allFollows = await this.prismaService.follow.findMany({
        include: { fromUser: true, toUser: true, toPost: true },
      })
      return allFollows
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  } 

  async findById(id: string) {
    try {
      const follow = await this.prismaService.follow.findFirst({
        where: { id: id },
        include: { fromUser: true, toUser: true, toPost: true },
      })
      return follow
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async updateFollow(data: UpdateFollowDto, id: string) {
    try {
        const result = await this.prismaService.follow.update({
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
    catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
    }
  }

  async removeFollow(id: string) {
    try {
        const result = await this.prismaService.follow.delete({
            where: { id: id },
        })
        if (result) {
            return { message: "Deleted Successfully" };
        } 
        else {
            return { message: "Something went wrong" };
        }  
    } 
    catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
    }
  }
}
