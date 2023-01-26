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
        });
        if (result) {
          return result;
        }
      } else {
        const result = await this.prismaService.post.create({
          data: {
            timestamp: data.timestamp,
            text: data.text,
            content: data.content,
            userId: existingUser.id,
          },
        });
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
      return await this.prismaService.post.findMany({
        include: {
          blob: true,
          location: true,
          gig: true,
          event: true,
        },
      });
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
      });
      return post;
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
