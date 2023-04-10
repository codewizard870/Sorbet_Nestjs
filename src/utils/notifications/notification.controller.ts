import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request
  } from "@nestjs/common";
  import { NotificationService } from "./notification.service";
  import { CreateNotificationDto } from "./dto/create-notification-dto";
  import { UpdateNotificationDto } from "./dto/update-notification-dto";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
  import { Public } from "src/utils/auth/constants";

  interface CreateNotification extends CreateNotificationDto, Notification {
    id: string;
    type: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
    readAt?: Date;
    userId?: string;
    postId?: string;
    commentId?: string;
    likeId?: string;
    followId?: string;
    chatId?: string;
    collabId?: string;
  }
  
  @ApiBearerAuth()
  @ApiTags("Notification")
  @Controller("/notification")
  export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}
  
    @Post('create')
    async create(@Body() createNotificationDto: CreateNotificationDto) {
      return await this.notificationService.create(createNotificationDto)
    }

    @Get('findAll')
    async findAll() {
      return await this.notificationService.findAll()
    }

    @Get('findAllUnread')
    async findAllUnread() {
      return await this.notificationService.findAllUnread()
    }

    @Get('findAllRead')
    async findAllRead() {
      return await this.notificationService.findAllRead()
    }

    @Get('findAllByType/:type')
    async findAllByType(@Param("type") type: string) {
      return await this.notificationService.findAllByType(type)
    }

    @Get('findAllBySenderId/:senderId')
    async findAllBySenderId(@Param("senderId") senderId: string) {
      return await this.notificationService.findAllBySenderId(senderId)
    }

    @Get('findAllByReceiverId/:receiverId')
    async findAllByReceiverId(@Param("receiverId") receiverId: string) {
      return await this.notificationService.findAllByReceiverId(receiverId)
    }

    @Get(':id')
    async findOne(@Param("id") id: string) {
      return await this.notificationService.findOne(id)
    }

    @Patch(':id')
    async update(@Param("id") id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
      return await this.notificationService.update(id, updateNotificationDto)
    }

    @Patch('updateAllToRead/:receiverId')
    async updateAll(@Param("receiverId") receiverId: string) {
      return await this.notificationService.updateMany(receiverId)
    }

    @Delete(':id')
    async delete(@Param("id") id: string) {
      return await this.notificationService.remove(id)
    }
  }
  