import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateAttendDto } from "./dto/create-attending-dto";
import { UpdateAttendDto } from "./dto/update-attending-dto";

@Injectable()
export class AttendService {
  constructor(private prismaService: PrismaService) {}

  async createAttend(data: CreateAttendDto) {
    try {
      const attend = await this.prismaService.attend.findFirst({
        where: { attendingUserId: data.attendingUserId, eventId: data.eventId }
      })
      if (attend) {
        console.log("Failed to add user to attending event")
        return { message: `user ${data.attendingUserId} is already attending event ${data.eventId}` }
      }
      const newAttend = await this.prismaService.attend.create({
        data: {
          type: data.type,
          attendingUserId: data.attendingUserId,
          eventId: data.eventId
        }
      })
      if (newAttend) {
        return newAttend
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllAttends() {
    try {
      const allAttends = await this.prismaService.attend.findMany({
        include: { attendingUser: true, event: true, notification: true },
      })
      if (allAttends) {
        return allAttends
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  } 

  async findById(id: string) {
    try {
      const attend = await this.prismaService.attend.findFirst({
        where: { id: id },
        include: { attendingUser: true, event: true, notification: true },
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

  async findByAttendingUserId(attendingUserId: string) {
    try {
      const attend = await this.prismaService.attend.findFirst({
        where: { attendingUserId: attendingUserId },
        include: { attendingUser: true, event: true, notification: true },
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

  async findByEventId(eventId: string) {
    try {
      const attend = await this.prismaService.attend.findFirst({
        where: { eventId: eventId },
        include: { attendingUser: true, event: true, notification: true },
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

  async updateAttend(data: UpdateAttendDto, id: string) {
    try {
        const result = await this.prismaService.attend.update({
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

  async removeAttend(id: string) {
    try {
        const result = await this.prismaService.attend.delete({
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
