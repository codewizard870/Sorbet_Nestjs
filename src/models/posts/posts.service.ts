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

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
    private likeService: LikeService,
    private commentService: CommentService
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
      } 
      else {
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
          like: true,
          commment: true
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
          blob: true,
          location: true,
          gig: true,
          event: true,
          like: true,
          commment: true
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

  async likePost(data: CreateLikeDto, userId: string) {
    try {
      if (data.postId) {
        const createdLike = await this.likeService.createPostLike(data, userId)
        if (createdLike) {
          return { message: `User: ${userId} successfully liked post: ${data.postId}` }
        }
        else {
          console.log(`User: ${userId} failed to like post: ${data.postId}`)
          return { message: `User: ${userId} failed to like post: ${data.postId}` }
        }
      }
      else {
        console.log(`Data missing postId`)
        throw new Error(`Data missing postId`)
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to like post.")
    }
  }

  async removeLikeFromPost(postId: string, likeId: string) {
    try {
      const post = await this.prismaService.post.findFirst({
        where: { id: postId },
        include: {like: true}
      })
      if (post) {
        for (let i = 0; i < post.like.length; i++) {
          if (post.like[i].id == likeId) {
            return await this.likeService.removeLike(likeId)
          }
          else {
            console.log(`Post: ${postId} does not have like: ${likeId}`)
            return { message: `Post: ${postId} does not have like: ${likeId}` }
          }
        }
      }
      else {
        console.log(`Unable to find post`)
        return { message: `Unable to find post` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async commentOnPost(data: CreateCommentDto, userId: string) {
    try {
      if (data.postId) {
        const createdComment = await this.commentService.createPostComment(data, userId)
        if (createdComment) {
          return createdComment
        }
        else {
          console.log(`User: ${userId} failed to comment on post: ${data.postId}`)
          return { message: `User: ${userId} failed to comment on post: ${data.postId}` }
        }
      }
      else {
        console.log(`Data missing postId`)
        throw new Error(`Data missing postId`)
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to comment on post.")
    }
  }

  async updatePostComment(updateCommentDto: UpdateCommentDto, commentId: string) {
    try {
      const updatedPost = await this.commentService.updateComment(updateCommentDto, commentId)
      if (updatedPost) {
        return updatedPost
      }
      else {
        console.log(`Unable to update comment: ${commentId}`)
        return { message: `Unable to update comment: ${commentId}` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async removeCommentFromPost(postId: string, commentId: string) {
    try {
      const post = await this.prismaService.post.findFirst({
        where: { id: postId },
        include: {commment: true}
      })
      if (post) {
        for (let i = 0; i < post.commment.length; i++) {
          if (post.commment[i].id == commentId) {
            return await this.likeService.removeLike(commentId)
          }
          else {
            console.log(`Post: ${postId} does not have comment: ${commentId}`)
            return { message: `Post: ${postId} does not have comment: ${commentId}` }
          }
        }
      }
      else {
        console.log(`Unable to find post`)
        return { message: `Unable to find post` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }
}


