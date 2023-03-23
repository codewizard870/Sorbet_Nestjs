import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "src/models/users/users.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateJobProfileDto } from "./dto/create-job-profile.dto";
import { UpdateJobProfileDto } from "./dto/update-job-profile.dto";

@Injectable()
export class JobProfileService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateJobProfileDto, userId: string) {
    try {
      const result = await this.prismaService.jobProfile.create({
        data: {
          name: data.name,
          type: data.type,
          userId: userId,
        },
      })
      if (result) {
        return result
      } 
      else {
        throw new BadRequestException("Error creating job profile")
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getAll() {
    try {
      const result = this.prismaService.jobProfile.findMany({
        include: {user: true},
      })
      if (result) {
        return result
      }
      else {
        throw new BadRequestException("No job profiles were found")
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getFromUserId(userId: string) {
    try {
      const result = await this.prismaService.jobProfile.findMany({
        where: { userId: userId },
        include: { user: true }
      })
      if (result) {
        return result
      } 
      else {
        throw new BadRequestException("Job profile not found")
      }  
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getFromJobName(name: string) {
    try {
      const result = await this.prismaService.jobProfile.findMany({
        where: { name: name },
        include: { user: true },
      })
      if (result) {
        return result
      }
      else {
        throw new BadRequestException("Job profile not found")
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getFromJobType(jobType: string) {
    try {
      const result = await this.prismaService.jobProfile.findMany({
        where: { type: jobType },
        include: { user: true },
      })
      if (result) {
        return result
      } 
      else {
        throw new BadRequestException("Job profile not found")
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getById(id: string) {
    try {
      const result = await this.prismaService.jobProfile.findMany({
        where: { id: id },
        include: { user: true },
      })
      if (result) {
        return result
      } 
      else {
        throw new BadRequestException("Job profile not found")
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async update(id: string, data: UpdateJobProfileDto) {
    try {
      const result = await this.prismaService.jobProfile.update({
        where: { id: id },
        data: data
      })
      if (result) {
        return result
      }
      else {
        throw new BadRequestException("Failed to updated job profile")
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async remove(id: string) {
    try {
      const result = await this.prismaService.jobProfile.delete({
        where: { id: id },
      });
      if (result) {
        return { message: "Deleted Successfully" }
      } 
      else {
        return { message: "Something went wrong" }
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }
}
