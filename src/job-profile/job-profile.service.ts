import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "src/models/users/users.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateJobProfileDto } from "./dto/create-job-profile.dto";
import { UpdateJobProfileDto } from "./dto/update-job-profile.dto";

@Injectable()
export class JobProfileService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateJobProfileDto, id: string) {
    try {
      const result = await this.prismaService.jobProfile.create({
        data: {
          name: data.name,
          type: data.type,
          userId: id,
        },
      });
      if (result) {
        return result;
      } else {
        throw new BadRequestException("Error occured");
      }
    } catch (error) {
      throw new BadRequestException("Unable to create User", error);
    }
  }

  async getFromUserId(userId: string) {
    try {
      const result = await this.prismaService.jobProfile.findMany({
        where: {
          userId: userId,
        },
      });
      if (result) {
        return result;
      } 
      else {
        throw new Error("Job profile not found.");
      }  
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }
  async getFromJobName(name: string) {
    try {
      const result = await this.prismaService.jobProfile.findMany({
        where: {
          name: name,
        },
        include: {
          user: true,
        },
      });
      if (result) {
        return result;
      }
      else {
        throw new Error("Job profile not found.");
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }
  async getFromJobType(jobType: string) {
    try {
      const result = await this.prismaService.jobProfile.findMany({
        where: { type: jobType },
        include: { user: true },
      });
      if (result) {
        return result;
      } 
      else {
        throw new Error("Job profile not found.");
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }

  async getFromJobId(id: string) {
    try {
      const result = await this.prismaService.jobProfile.findMany({
        where: { id: id },
        include: {user: true},
      });
      if (result) {
        return result;
      } 
      else {
        throw new Error("Job profile not found.");
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }

  async getAll() {
    try {
      const result = this.prismaService.jobProfile.findMany({
        include: {user: true},
      });
      if(result) {
        return result;
      }
      else {
        throw new Error("No job profiles were found.");
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
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
        console.log("Failed to updated job profile")
        return { message: "Failed to updated job profile" }
      }
    } 
    catch (error) {
      
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
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }
}
