import { BadRequestException, Injectable } from "@nestjs/common";
import { TimezonesService } from "src/timezones/timezones.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { LikeService } from "src/utils/like/like.service";
import { CommentService } from "src/utils/comment/comment.service";
import { CreateLikeDto } from "src/utils/like/dto/create-like-dto";
import { CreateCommentDto } from "src/utils/comment/dto/create-comment-dto";
import { UpdateCommentDto } from "src/utils/comment/dto/update-comment-dto";

@Injectable()
export class EventsService {
  constructor(
    private prismaService: PrismaService,
    private timezonesService: TimezonesService,
    private likeService: LikeService,
    private commentService: CommentService
  ) {}

  async create(data: CreateEventDto) {
    try {
      const utcStartDate = this.timezonesService.convertToUtc(data.start_date);
      const utcEndDate = this.timezonesService.convertToUtc(data.end_date);
  
      const result = await this.prismaService.event.create({
        data: {
          postId: data.postId,
          name: data.name,
          event_image: data.event_image,
          start_date: utcStartDate,
          end_date: utcEndDate,
          event_link: data.event_link,
          description: data.description,
          timezone: data.timezone,
        },
      });
      if (result) {
        return result;
      } 
      else {
        throw new BadRequestException();
      } 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAll() {
    try {
      const allEvents =  await this.prismaService.event.findMany({
        include: { location: true, post: true, commment: true },
      })
      if (allEvents) {
        return allEvents
      }
      else {
        console.log("Failed to find all events")
        return { message: 'Failed to find all events' }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(_id: string) {
    try {
      const event = await this.prismaService.event.findFirst({
        where: { id: _id },
        include: { location: true, post: true, like: true, commment: true },
      })
      return event
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    try {
      const updatedEvent = await this.prismaService.event.update({
        where: { id: id },
        // @ts-ignore
        data: updateEventDto
      })
      if (updatedEvent) {
        return { message: `Successfully updated event` }
      }
      else {
        console.log(`Failed to remove event ${id}`)
        return { message: `Failed to update event` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to remove event.")
    }
  }

  async remove(id: string) {
    try {
      const removedEvent = await this.prismaService.event.delete({
        where: { id: id },
      })
      if (removedEvent) {
        return { message: `Successfully removed event` }
      }
      else {
        console.log(`Failed to remove event ${id}`)
        return { message: `Failed to remove event` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to remove event.")
    }
  }

  async likeEvent(data: CreateLikeDto, userId: string) {
    try {
      if (data.eventId) {
        const createdLike = await this.likeService.createEventLike(data, userId)
        if (createdLike) {
          return { message: `User: ${userId} successfully liked post: ${data.eventId}` }
        }
        else {
          console.log(`User: ${userId} failed to like event: ${data.eventId}`)
          return { message: `User: ${userId} failed to like event: ${data.eventId}` }
        }
      }
      else {
        console.log(`Data missing eventId`)
        throw new Error(`Data missing eventId`)
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to like event.")
    }
  }

  async removeLikeFromEvent(eventId: string, likeId: string) {
    try {
      const event = await this.prismaService.event.findFirst({
        where: { id: eventId },
        include: { like: true }
      })
      if (event) {
        for (let i = 0; i < event.like.length; i++) {
          if (event.like[i].id == likeId) {
            return await this.likeService.removeLike(likeId)
          }
          else {
            console.log(`Event: ${eventId} does not have like: ${likeId}`)
            return { message: `Event: ${eventId} does not have like: ${likeId}` }
          }
        }
      }
      else {
        console.log(`Unable to find event`)
        return { message: `Unable to find event` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async commentOnEvent(data: CreateCommentDto, userId: string) {
    try {
      if (data.eventId) {
        const createdComment = await this.commentService.createEventComment(data, userId)
        if (createdComment) {
          return createdComment
        }
        else {
          console.log(`User: ${userId} failed to comment on event: ${data.eventId}`)
          return { message: `User: ${userId} failed to comment on event: ${data.eventId}` }
        }
      }
      else {
        console.log(`Data missing eventId`)
        throw new Error(`Data missing eventId`)
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to comment event.")
    }
  }

  async updateEventComment(updateCommentDto: UpdateCommentDto, commentId: string) {
    try {
      const updatedEvent = await this.commentService.updateComment(updateCommentDto, commentId)
      if (updatedEvent) {
        return updatedEvent
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

  async removeCommentFromEvent(eventId: string, commentId: string) {
    try {
      const event = await this.prismaService.event.findFirst({
        where: { id: eventId },
        include: {commment: true}
      })
      if (event) {
        for (let i = 0; i < event.commment.length; i++) {
          if (event.commment[i].id == commentId) {
            return await this.likeService.removeLike(commentId)
          }
          else {
            console.log(`Event: ${eventId} does not have comment: ${commentId}`)
            return { message: `Event: ${eventId} does not have comment: ${commentId}` }
          }
        }
      }
      else {
        console.log(`Unable to find event`)
        return { message: `Unable to find event` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }
}
