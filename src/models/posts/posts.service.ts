import { Injectable } from "@nestjs/common";
import { LikeService } from "../../utils/like/like.service";
import { CreateLikeDto } from "src/utils/like/dto/create-like-dto";
import { CreateCommentDto } from "src/utils/comment/dto/create-comment-dto";
import { UpdateCommentDto } from "src/utils/comment/dto/update-comment-dto";
import { CommentService } from "../../utils/comment/comment.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { LocationsService } from "../locations/locations.service";

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
    private likeService: LikeService,
    private commentService: CommentService,
  ) { };

  async create(data: CreatePostDto) {
    try {
      const existingUser = await this.usersService.getUserFromId(data.userId.toString());
      const result = await this.prismaService.post.create({
        data: {
          title: data.title,
          createdAt: new Date(Date.now()),
          description: data.description,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          serviceType: data.serviceType,
          category: data.category,
          subCategory: data.subCategory,
          seachTags: data.seachTags,
          salary: data.salary,
          startDate: data.startDate,
          endDate: data.endDate,
          startTime: data.startTime,
          endTime: data.endTime,
          venue: data.venue,
          externalLink: data.externalLink,
          postType: data.postType,
          userId: existingUser.id
        },
      })
      if (result) {
        if (data.address) {
          try {
            const res = await this.prismaService.location.create({
              data: {
                locationType: data.serviceType,
                address: data.address,
                langitude: data.langitude,
                latitude: data.latitude,
                postId: result.id,
              }
            });
          } catch (error) {
            console.log(error);
          }
        }
        return result;
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
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        include: {
          user: true,
          location: true,
          likes: {
            include: {
              user: true,
            },
          },
          comments: {
            include: {
              user: true,
            },
          },
          followers: true,
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

  async findOne(id: string) {
    try {
      const post = await this.prismaService.post.findFirst({
        where: { id: id },
        include: {
          location: true,
          user: true,
          likes: {
            include: {
              user: true
            }
          },
          comments: {
            include: {
              user: true
            }
          },
          followers: true,
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

  async findAllByUserId(userId: string) {
    try {
      const userPosts = await this.prismaService.post.findMany({
        where: { userId: userId },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        include: {
          location: true,
          user: true,
          likes: {
            include: {
              user: true
            }
          },
          comments: {
            include: {
              user: true
            }
          },
          followers: true,
        },
      })
      if (userPosts) {
        return userPosts
      }
      else {
        console.log("Could not find posts by userId.")
        throw new Error("Could not find posts by userId.")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllGigs() {
    try {
      const gigs = await this.prismaService.post.findMany({
        // where: { postType: "Gig" },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        include: {
          user: true,
          location: true,
          likes: {
            include: {
              user: true,
            },
          },
          comments: {
            include: {
              user: true,
            },
          },
          followers: true,
        },
      })
      if (gigs) {
        return gigs
      }
      else {
        console.log("Could not find gigs")
        throw new Error("Could not find gigs")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllEvents() {
    try {
      const events = await this.prismaService.post.findMany({
        // where: { postType: "Event" },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        include: {
          user: true,
          location: true,
          likes: {
            include: {
              user: true,
            },
          },
          comments: {
            include: {
              user: true,
            },
          },
          followers: true,
        },
      })
      if (events) {
        return events
      }
      else {
        console.log("Could not find events")
        throw new Error("Could not find events")
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
