import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateNotificationDto } from "./dto/create-notification-dto";
import { UpdateNotificationDto } from "./dto/update-notification-dto";
import { NotificationGateway } from "../websocket/notification.gateway";

interface CreateNotification extends CreateNotificationDto, Notification {
  id: string;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
  senderId?: string;
  receiverId?: string
  postId?: string;
  commentId?: string;
  likeId?: string;
  followId?: string;
  chatId?: string;
  collabId?: string;
}

@Injectable()
export class NotificationService {
  constructor(
    private prismaService: PrismaService,
    private readonly notificationGateway: NotificationGateway
  ) {}

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
            senderId: data.senderId,
            receiverId: data.receiverId,
            postId: data.postId,
            commentId: data.commentId,
            likeId: data.likeId,
            followId: data.followId,
            chatId: data.chatId,
            collabId: data.collabId
          }
        })
        if (newNotification) {
          await this.notificationGateway.handleSendNotification(
            newNotification.senderId, 
            newNotification.receiverId, 
            newNotification.type
          )
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
            sender: true,
            receiver: true,
            post: true, 
            comment: true, 
            like: true, 
            follow: true, 
            chat: true, 
            collab: true,
            attending: true,
            applied: true,
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

  async findAllUnread(receiverId: string) {
    try {
      const allNotification = await this.prismaService.notification.findMany({
        where: { 
          receiverId: receiverId,
          read: false 
        },
        include: { 
          sender: true,
          receiver: true,
          post: true, 
          comment: true, 
          like: true, 
          follow: true, 
          chat: true, 
          collab: true,
          attending: true,
          applied: true,
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

  async findAllRead(receiverId: string) {
    try {
      const allNotification = await this.prismaService.notification.findMany({
        where: { 
          receiverId: receiverId,
          read: false 
        },
        include: { 
          sender: true,
          receiver: true,
          post: true, 
          comment: true, 
          like: true, 
          follow: true, 
          chat: true, 
          collab: true,
          attending: true,
          applied: true,
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
          sender: true,
          receiver: true,
          post: true, 
          comment: true, 
          like: true, 
          follow: true, 
          chat: true, 
          collab: true,
          attending: true,
          applied: true,
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

  async findAllBySenderId(senderId: string) {
    try {
      const allNotification = await this.prismaService.notification.findMany({
        where: { senderId: senderId },
        include: { 
          sender: true,
          receiver: true,
          post: true, 
          comment: true, 
          like: true, 
          follow: true, 
          chat: true, 
          collab: true,
          attending: true,
          applied: true,
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

  async findAllByReceiverId(receiverId: string) {
    try {
      const allNotification = await this.prismaService.notification.findMany({
        where: { receiverId: receiverId },
        include: { 
          sender: true,
          receiver: true,
          post: true, 
          comment: true, 
          like: true, 
          follow: true, 
          chat: true, 
          collab: true,
          attending: true,
          applied: true,
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
          sender: true,
          receiver: true,
          post: true, 
          comment: true, 
          like: true, 
          follow: true, 
          chat: true, 
          collab: true,
          attending: true,
          applied: true,
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
              sender: true,
              receiver: true,
              post: true, 
              comment: true, 
              like: true, 
              follow: true, 
              chat: true, 
              collab: true,
              attending: true,
              applied: true,
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

  async updateMany(receiverId: string) {
    try {
        const updatedNotifications = await this.prismaService.notification.updateMany({
            where: { 
              receiverId: receiverId,
              read: false 
            },
            data: { 
              read: true,
              readAt: new Date(Date.now())
            },
        })

        if (updatedNotifications) {
            return updatedNotifications
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