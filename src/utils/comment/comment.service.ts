import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment-dto";
import { UpdateCommentDto } from "./dto/update-comment-dto";

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async createPostComment(data: CreateCommentDto, userId: string) {
    try {
      const newComment = await this.prismaService.comment.create({
        data: {
          createdAt: data.createdAt,
          text: data.text,
          userId: userId,
          postId: data.postId
        }
      })
      if (newComment) {
        return newComment
      }
      else {
        console.log(`Error creating post comment for user: ${userId}.`)
        return { message: `Error creating post comment for user: ${userId}.`}
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async createEventComment(data: CreateCommentDto, userId: string) {
    try {
      const newComment = await this.prismaService.comment.create({
        data: {
          createdAt: data.createdAt,
          text: data.text,
          userId: userId,
          eventId: data.eventId
        }
      })
      if (newComment) {
        return newComment
      }
      else {
        console.log(`Error creating event comment for user: ${userId}.`)
        return { message: `Error creating event comment for user: ${userId}.`}
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async createGigComment(data: CreateCommentDto, userId: string) {
    try {
      const newComment = await this.prismaService.comment.create({
        data: {
          createdAt: data.createdAt,
          text: data.text,
          userId: userId,
          gigId: data.gigId
        }
      })
      if (newComment) {
        return newComment
      }
      else {
        console.log(`Error creating gig comment for user: ${userId}.`)
        return { message: `Error creating gig comment for user: ${userId}.`}
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllCommentsForPost(postId: string) {
    try {
      const postLikes =  await this.prismaService.comment.findMany({
        where: { postId: postId },
        include: { post: true }
      })
      if (postLikes) {
        return postLikes
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

  async findAllCommentsForEvent(eventId: string) {
    try {
      const eventLikes = await this.prismaService.comment.findMany({
        where: { eventId: eventId },
        include: { event: true }
      })
      if (eventLikes) {
        return eventLikes
      }
      else {
        console.log(`Unable to get all comments for event: ${eventId}`)
        return { message: `Unable to get post comments for event: ${eventId}` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllCommentsForGig(gigId: string) {
    try {
      const gigLikes = await this.prismaService.like.findMany({
        where: { gigId: gigId },
        include: { gig: true }
      })
      if (gigLikes) {
        return gigLikes
      }
      else {
        console.log(`Unable to get all comments for gig: ${gigId}`)
        return { message: `Unable to get post comments for gig: ${gigId}` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(id: string) {
    try {
      const comment = await this.prismaService.comment.findFirst({
        where: { id: id },
        include: { user: true, event: true, gig: true, post: true },
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
