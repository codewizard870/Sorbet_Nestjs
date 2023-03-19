import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment-dto";
import { UpdateCommentDto } from "./dto/update-comment-dto";

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async createComment(data: CreateCommentDto) {
    try {
      const newComment = await this.prismaService.comment.create({
        data: {
          createdAt: new Date(Date.now()),
          content: data.content,
          userId: data.userId,
          postId: data.postId
        }
      })
      if (newComment) {
        return newComment
      }
      else {
        console.log(`Error creating post comment for user: ${data.userId}.`)
        return { message: `Error creating post comment for user: ${data.userId}.`}
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllCommentsForPost(postId: string) {
    try {
      const postComments =  await this.prismaService.comment.findMany({
        where: { postId: postId },
        include: { post: true, user: true }
      })
      if (postComments) {
        return postComments
      }
      else {
        console.log(`Unable to get all comments for post: ${postId}`)
        return { message: `Unable to get all comments for post: ${postId}` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllCommentsForUser(userId: string) {
    try {
      const userComments =  await this.prismaService.comment.findMany({
        where: { userId: userId },
        include: { post: true, user: true }
      })
      if (userComments) {
        return userComments
      }
      else {
        console.log(`Unable to get all comments for post: ${userId}`)
        return { message: `Unable to get all comments for post: ${userId}` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllComments() {
    try {
      const allComments = await this.prismaService.comment.findMany({
        include: { post: true, user: true },
      })
      return allComments
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  } 

  async findById(id: string) {
    try {
      const comment = await this.prismaService.comment.findFirst({
        where: { id: id },
        include: { post: true, user: true },
      })
      return comment
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async updateComment(data: UpdateCommentDto, id: string) {
    try {
        const result = await this.prismaService.comment.update({
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

  async removeComment(id: string) {
    try {
        const result = await this.prismaService.comment.delete({
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
