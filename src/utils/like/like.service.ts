import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateLikeDto } from "./dto/create-like-dto";
import { UpdateLikeDto } from "./dto/update-like-dto";

@Injectable()
export class LikeService {
  constructor(private prismaService: PrismaService) {}

  async createPostLike(data: CreateLikeDto, userId: string) {
    try {
      const existingLike = await this.prismaService.like.findUnique({
        where: {userId: userId, postId: data.postId},
        include: { post: true }
      })
      if (existingLike) {
        return {
          message: `User: ${userId} has already liked post`,
          existingLike
        }
      }
      else {
        const newLike = await this.prismaService.like.create({
          data: {
            createdAt: data.createdAt,
            userId: userId,
            postId: data.postId
          }
        })
        if (newLike) {
          return newLike
        }
        else {
          console.log(`Error creating post like for user: ${userId}.`)
          return { message: `Error creating post like for user: ${userId}.`}
        }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async createEventLike(data: CreateLikeDto, userId: string) {
    try {
      const existingLike = await this.prismaService.like.findUnique({
        where: {userId: userId, eventId: data.eventId},
        include: { event: true }
      })
      if (existingLike) {
        return {
          message: `User: ${userId} has already liked event`,
          existingLike
        }
      }
      else {
        const newLike = await this.prismaService.like.create({
          data: {
            createdAt: data.createdAt,
            userId: userId,
            eventId: data.eventId
          }
        })
        if (newLike) {
          return newLike
        }
        else {
          console.log(`Error creating event like for user: ${userId}.`)
          return { message: `Error creating event like for user: ${userId}.`}
        }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async createGigLike(data: CreateLikeDto, userId: string) {
    try {
      const existingLike = await this.prismaService.like.findUnique({
        where: {userId: userId, gigId: data.gigId},
        include: { gig: true }
      })
      if (existingLike) {
        return {
          message: `User: ${userId} has already liked gig`,
          existingLike
        }
      }
      else {
        const newLike = await this.prismaService.like.create({
          data: {
            createdAt: data.createdAt,
            userId: userId,
            gigId: data.gigId
          }
        })
        if (newLike) {
          return newLike
        }
        else {
          console.log(`Error creating event like for user: ${userId}.`)
          return { message: `Error creating event like for user: ${userId}.`}
        }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllLikesForPost(postId: string) {
    try {
      const postLikes =  await this.prismaService.like.findMany({
        where: { postId: postId },
        include: { post: true }
      })
      if (postLikes) {
        return postLikes
      }
      else {
        console.log(`Unable to get all likes for post: ${postId}`)
        return { message: `Unable to get all likes for post: ${postId}` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }
  
  async findAllLikesForEvent(eventId: string) {
    try {
      const eventLikes = await this.prismaService.like.findMany({
        where: { eventId: eventId },
        include: { event: true }
      })
      if (eventLikes) {
        return eventLikes
      }
      else {
        console.log(`Unable to get all likes for event: ${eventId}`)
        return { message: `Unable to get post likes for event: ${eventId}` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllLikesForGig(gigId: string) {
    try {
      const gigLikes = await this.prismaService.like.findMany({
        where: { gigId: gigId },
        include: { gig: true }
      })
      if (gigLikes) {
        return gigLikes
      }
      else {
        console.log(`Unable to get all likes for gig: ${gigId}`)
        return { message: `Unable to get post likes for gig: ${gigId}` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(id: string) {
    try {
      const like = await this.prismaService.like.findFirst({
        where: { id: id }
      })
      if (like) {
        return like
      }
      else {
        console.log(`Could not find like by id: ${id}`)
        return { message: `Could not find like by id: ${id}` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }
  
  async removeLike(id: string) {
    try {
      const result = await this.prismaService.like.delete({
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