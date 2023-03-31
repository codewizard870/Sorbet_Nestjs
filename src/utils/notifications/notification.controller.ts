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

    @Get(':id')
    async findOne(@Param("id") id: string) {
      return await this.notificationService.findOne(id)
    }

    @Patch(':id')
    async update(@Param("id") id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
      return await this.notificationService.update(id, updateNotificationDto)
    }

    @Delete(':id')
    async delete(@Param("id") id: string) {
      return await this.notificationService.remove(id)
    }
  }
  