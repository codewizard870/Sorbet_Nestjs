import { Injectable } from "@nestjs/common";
import { Content } from "@prisma/client";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService
  ) {}

  async create(data: CreatePostDto, email: string) {
    try {
      const existingUser = await this.usersService.getUserFromEmail(email);
      if (data.content === "Gig" || data.content === "Event") {
        const result = await this.prismaService.post.create({
          data: {
            timestamp: data.timestamp,
            content: data.content,
            userId: existingUser.id,
          },
        })
        if (result) {
          return result
        }
      } else {
        const result = await this.prismaService.post.create({
          data: {
            timestamp: data.timestamp,
            text: data.text,
            content: data.content,
            userId: existingUser.id,
          },
        })
        if (result) {
          return result;
        }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAll() {
    try {
      const posts = await this.prismaService.post.findMany({
        include: {
          blob: true,
          location: true,
          gig: true,
          event: true,
        },
      })
      if (posts) {
        return posts
      }
      else {
        console.log("Could not find posts")
        throw new Error("Could not find posts")
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(_id: string) {
    try {
      const post = await this.prismaService.post.findFirst({
        where: { id: _id },
        include: {
          blob: true,
          location: true,
          gig: true,
          event: true,
        },
      })
      if (post) {
        return post
      }
      else {
        console.log("Could not find post")
        throw new Error("Could not find post")
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findByUserId(userId: string) {
    try {
      const post = await this.prismaService.post.findFirst({
        where: { userId: userId },
        include: {
          blob: true,
          location: true,
          gig: true,
          event: true,
        },
      })
      if (post) {
        return post
      }
      else {
        console.log("Could not find post.")
        throw new Error("Could not find post.")
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const updatedPost = await this.prismaService.post.update({
        where: { id: id },
        data: updatePostDto
      })
      if (updatedPost) {
        return { message: `Successfully updated post` }
      }
      else {
        console.log(`Failed to update post ${id}`)
        return { message: `Failed to upate post` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to upate post.")
    }
  }

  async remove(id: string) {
    try {
      const removedPost = await this.prismaService.post.delete({
        where: { id: id },
      })
      if (removedPost) {
        return { message: `Successfully removed post` }
      }
      else {
        console.log(`Failed to remove post ${id}`)
        return { message: `Failed to remove post` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to remove post.")
    }
  }
}
