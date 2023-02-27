import { Injectable } from "@nestjs/common";
import { TimezonesService } from "src/timezones/timezones.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateGigDto } from "./dto/create-gig.dto";
import { UpdateGigDto } from "./dto/update-gig.dto";
import { LikeService } from "src/utils/like/like.service";
import { CommentService } from "src/utils/comment/comment.service";
import { CreateLikeDto } from "src/utils/like/dto/create-like-dto";
import { CreateCommentDto } from "src/utils/comment/dto/create-comment-dto";
import { UpdateCommentDto } from "src/utils/comment/dto/update-comment-dto";


@Injectable()
export class GigsService {
  constructor(
    private prismaService: PrismaService,
    private timezonesService: TimezonesService,
    private likeService: LikeService,
    private commentService: CommentService
  ) {}

  async create(data: CreateGigDto) {
    try {
      // const utcStartDate = this.timezonesService.convertToUtc(data.start_date);
      // const utcEndDate = this.timezonesService.convertToUtc(data.end_date);
      const result = await this.prismaService.gig.create({
        data: {
          postId: data.postId,
          timezone: data.timezone,
          start_date: data.start_date,
          end_date: data.end_date,
          title: data.title,
          description: data.description,
          gig_price_min: data.gig_price_min,
          gig_price_max: data.gig_price_max,
          tags: data.tags,
        },
      });
      if (result) {
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
      const allGigs = await this.prismaService.gig.findMany({
        include: { location: true },
      })
      if (allGigs) {
        return allGigs
      }
      else {
        console.log("Failed to find all gigs")
        return { message: 'Failed to find all gigs' }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(_id: string) {
    try {
      const gig = await this.prismaService.gig.findFirst({
        where: { id: _id },
        include: { location: true },
      })
      return gig
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async update(id: string, updateGigDto: UpdateGigDto) {
    try {
      const updatedGig = await this.prismaService.gig.update({
        where: { id: id },
        data: updateGigDto
      })
      if (updatedGig) {
        return { message: `Successfully updated gig` }
      }
      else {
        console.log(`Failed to update gig ${id}`)
        return { message: `Failed to update gig` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to update gig.")
    }
  }

  async remove(id: string) {
    try {
      const removedGig = await this.prismaService.gig.delete({
        where: { id: id },
      })
      if (removedGig) {
        return { message: `Successfully removed gig` }
      }
      else {
        console.log(`Failed to remove gig ${id}`)
        return { message: `Failed to remove gig` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to remove gig.")
    }
  }

  async likeGig(data: CreateLikeDto, userId: string) {
    try {
      if (data.gigId) {
        const createdLike = await this.likeService.createGigLike(data, userId)
        if (createdLike) {
          return { message: `User: ${userId} successfully liked post: ${data.gigId}` }
        }
        else {
          console.log(`User: ${userId} failed to like gig: ${data.gigId}`)
          return { message: `User: ${userId} failed to like gig: ${data.gigId}` }
        }
      }
      else {
        console.log(`Data missing gigId`)
        throw new Error(`Data missing gigId`)
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to like gig.")
    }
  }

  async removeLikeFromGig(gigId: string, likeId: string) {
    try {
      const gig = await this.prismaService.gig.findFirst({
        where: { id: gigId },
        include: { like: true }
      })
      if (gig) {
        for (let i = 0; i < gig.like.length; i++) {
          if (gig.like[i].id == likeId) {
            return await this.likeService.removeLike(likeId)
          }
          else {
            console.log(`Gig: ${gigId} does not have like: ${likeId}`)
            return { message: `Gig: ${gigId} does not have like: ${likeId}` }
          }
        }
      }
      else {
        console.log(`Unable to find gig`)
        return { message: `Unable to find gig` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async commentOnGig(data: CreateCommentDto, userId: string) {
    try {
      if (data.gigId) {
        const createdComment = await this.commentService.createGigComment(data, userId)
        if (createdComment) {
          return createdComment
        }
        else {
          console.log(`User: ${userId} failed to comment on gig: ${data.gigId}`)
          return { message: `User: ${userId} failed to comment on gig: ${data.gigId}` }
        }
      }
      else {
        console.log(`Data missing gigId`)
        throw new Error(`Data missing gigId`)
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to comment gig.")
    }
  }

  async updateGigComment(updateCommentDto: UpdateCommentDto, commentId: string) {
    try {
      const updatedGig = await this.commentService.updateComment(updateCommentDto, commentId)
      if (updatedGig) {
        return updatedGig
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

  async removeCommentFromGig(gigId: string, commentId: string) {
    try {
      const gig = await this.prismaService.gig.findFirst({
        where: { id: gigId },
        include: {commment: true}
      })
      if (gig) {
        for (let i = 0; i < gig.commment.length; i++) {
          if (gig.commment[i].id == commentId) {
            return await this.likeService.removeLike(commentId)
          }
          else {
            console.log(`Gig: ${gigId} does not have comment: ${commentId}`)
            return { message: `Gig: ${gigId} does not have comment: ${commentId}` }
          }
        }
      }
      else {
        console.log(`Unable to find gig`)
        return { message: `Unable to find gig` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }
}
