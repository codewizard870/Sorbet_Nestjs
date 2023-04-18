import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateApplyDto } from "./dto/create-apply-dto";
import { UpdateApplyDto } from "./dto/update-apply-dto";

@Injectable()
export class ApplyService {
  constructor(private prismaService: PrismaService) {}

  async createApply(data: CreateApplyDto) {
    try {
      const apply = await this.prismaService.apply.findFirst({
        where: { appliedUserId: data.appliedUserId, gigId: data.gigId }
      })
      if (apply) {
        console.log("Failed to apply to gig")
        return { message: `user ${data.appliedUserId} is already applied to gig ${data.gigId}` }
      }
      const newApply = await this.prismaService.apply.create({
        data: {
          type: data.type,
          appliedUserId: data.appliedUserId,
          gigId: data.gigId
        }
      })
      if (newApply) {
        return newApply
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllApplications() {
    try {
      const allApplications = await this.prismaService.apply.findMany({
        include: { appliedUser: true, gig: true, notification: true },
      })
      if (allApplications) {
        return allApplications
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  } 

  async findById(id: string) {
    try {
      const application = await this.prismaService.apply.findFirst({
        where: { id: id },
        include: { appliedUser: true, gig: true, notification: true },
      })
      if (application) {
        return application
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findByAppliedUserId(appliedUserId: string) {
    try {
      const attend = await this.prismaService.apply.findFirst({
        where: { appliedUserId: appliedUserId },
        include: { appliedUser: true, gig: true, notification: true },
      })
      if (attend) {
        return attend
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findByGigId(gigId: string) {
    try {
      const application = await this.prismaService.apply.findFirst({
        where: { gigId: gigId },
        include: { appliedUser: true, gig: true, notification: true },
      })
      if (application) {
        return application
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async updateApply(data: UpdateApplyDto, id: string) {
    try {
        const result = await this.prismaService.apply.update({
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

  async removeApply(id: string) {
    try {
        const result = await this.prismaService.apply.delete({
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
