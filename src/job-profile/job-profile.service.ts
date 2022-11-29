import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "src/models/users/users.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateJobProfileDto } from "./dto/create-job-profile.dto";
import { UpdateJobProfileDto } from "./dto/update-job-profile.dto";

@Injectable()
export class JobProfileService {
  constructor(private prismaService: PrismaService) {}

  async create(data, id) {
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

  async getFromUserId(userId) {
    const result = await this.prismaService.jobProfile.findMany({
      where: {
        userId: userId,
      },
    });
    if (result) {
      console.log("resultttttt", result);

      return result;
    }
  }
  async getFromJobName(name) {
    const result = await this.prismaService.jobProfile.findMany({
      where: {
        name: name,
      },
      include: {
        user: true,
      },
    });
    if (result) {
      console.log("resultttttt", result);

      return result;
    }
  }
  async getFromjobType(jobType) {
    const result = await this.prismaService.jobProfile.findMany({
      where: {
        type: jobType,
      },
      include: {
        user: true,
      },
    });
    if (result) {
      console.log("resultttttt", result);

      return result;
    }
  }

  async getFromJobId(id) {
    try {
      const jobProfile = await this.prismaService.jobProfile.findFirst({
        where: { id: id },
        include: {
          user: true,
        },
      });
      return jobProfile;
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  }

  async getAll() {
    try {
      const job = this.prismaService.jobProfile.findMany({
        include: {
          user: true,
        },
      });
      return job;
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  }

  async remove(id) {
    const result = await this.prismaService.jobProfile.delete({
      where: { id: id },
    });
    if (result) {
      return { message: "deleted Successfully" };
    } else {
      return { message: "Something went wrong" };
    }
  }
}
