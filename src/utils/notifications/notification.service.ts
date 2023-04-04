import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateNotificationDto } from "./dto/create-notification-dto";
import { UpdateNotificationDto } from "./dto/update-notification-dto";

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) { }

  async create(data: CreateNotificationDto) {
    try {
        const newNotification = await this.prismaService.notification.create({
          data: {
            type: data.type,
            message: data.message,
            link: data.link,
            read: false,
            createdAt: data.createdAt,
            readAt: data.readAt,
            userId: data.userId,
            postId: data.postId,
            commentId: data.commentId,
            likeId: data.likeId,
            followId: data.followId,
            chatId: data.chatId,
            collabId: data.collabId
          }
        })
        if (newNotification) {
          return newNotification
        }
    }
    catch (error: any) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAll() {
    try {
        const allNotification = await this.prismaService.notification.findMany({
          include: { 
            user: true, 
            post: true, 
            comment: true, 
            like: true, 
            follow: true, 
            chat: true, 
            collab: true 
          }
        })
        if (allNotification) {
          return allNotification
        } 
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAllByType(type: string) {
    try {
      const allNotification = await this.prismaService.notification.findMany({
        where: { type: type },
        include: { 
          user: true, 
          post: true, 
          comment: true, 
          like: true, 
          follow: true, 
          chat: true, 
          collab: true 
        }
      })
      if (allNotification) {
        return allNotification
      } 
    } 
  catch (error) {
    console.error(error)
    throw new Error("An error occured. Please try again.")
  }
  }

  async findAllByUserId(userId: string) {
    try {
      const allNotification = await this.prismaService.notification.findMany({
        where: { userId: userId },
        include: { 
          user: true, 
          post: true, 
          comment: true, 
          like: true, 
          follow: true, 
          chat: true, 
          collab: true 
        }
      })
      if (allNotification) {
        return allNotification
      } 
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(id: string) {
    try {
      const notification = await this.prismaService.notification.findUnique({
        where: { id: id },
        include: { 
            user: true, 
            post: true, 
            comment: true, 
            like: true, 
            follow: true, 
            chat: true, 
            collab: true 
          }
      })
      if (notification) {
        return notification
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
        const updatedNotification = await this.prismaService.notification.update({
            where: { id: id },
            data: updateNotificationDto,
            include: {
                user: true,
                post: true,
                comment: true,
                like: true,
                follow: true,
                chat: true,
                collab: true
            }
        })

        if (updatedNotification) {
            return updatedNotification
        }
    } 
    catch (error) {
        console.error(error)
        throw new Error("An error occured. Please try again.") 
    }
  }

  async remove(id: string) {
    try {
      const result = await this.prismaService.notification.delete({
        where: { id: id },
      })
      if (result)
        return { message: "Deleted Successfully" };
      else
        return { message: "Something went wrong" };
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }
}