import { Injectable } from "@nestjs/common";
import { TimezonesService } from "src/timezones/timezones.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreateGigDto } from "./dto/create-gig.dto";
import { UpdateGigDto } from "./dto/update-gig.dto";

@Injectable()
export class GigsService {
  constructor(
    private prismaService: PrismaService,
    private timezonesService: TimezonesService
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
      throw new Error("Failed to remove event.")
    }
  }
}
