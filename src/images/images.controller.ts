import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  Request,
  Body,
  UseInterceptors,
  Query,
  Delete,
} from "@nestjs/common";
import { ImagesService } from "./images.service";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

// @ApiBearerAuth()
@ApiTags("images")
@Controller("/images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post("uploadProfileImage")
  // @UseInterceptors(FileInterceptor("file"))
  async uploadProfileImage(/*@UploadedFile() filePath: Express.Multer.File*/ @Body() body) {
    return await this.imagesService.uploadProfileImage(body.filePath, body.userId)
  }

  @Post("uploadPostImage")
  // @UseInterceptors(FileInterceptor("file"))
  async uploadPostImage(/*@UploadedFile() filePath: Express.Multer.File*/ @Body() body) {
    return await this.imagesService.uploadProfileImage(body.filePath, body.userId)
  }

  @Post("uploadEventImage")
  // @UseInterceptors(FileInterceptor("file"))
  async uploadEventImage(/*@UploadedFile() filePath: Express.Multer.File*/ @Body() body) {
    return await this.imagesService.uploadProfileImage(body.filePath, body.userId)
  }

  @Post("uploadGigImage")
  // @UseInterceptors(FileInterceptor("file"))
  async uploadGigImage(/*@UploadedFile() filePath: Express.Multer.File*/ @Body() body) {
    return await this.imagesService.uploadProfileImage(body.filePath, body.userId)
  }

  @Post("uploadWidgetImage")
  // @UseInterceptors(FileInterceptor("file"))
  async uploadWidgetImage(/*@UploadedFile() filePath: Express.Multer.File*/ @Body() body) {
    return await this.imagesService.uploadProfileImage(body.filePath, body.userId)
  }

  @Get("downloadProfileImage/:userId")
  async downloadProfileImage(@Param() userId: string, @Query() destFileName: string) {
    return await this.imagesService.downloadProfileImage(userId, destFileName)
  }

  @Get("downloadPostImage/:userId")
  async downloadPostImage(@Param() userId: string, @Query() destFileName: string) {
    return await this.imagesService.downloadPostImage(userId, destFileName)
  }

  @Get("downloadGigImage/:userId")
  async downloadGigImage(@Param() userId: string, @Query() destFileName: string) {
    return await this.imagesService.downloadGigImage(userId, destFileName)
  }

  @Get("downloadEventImage/:userId")
  async downloadEventImage(@Param() userId: string, @Query() destFileName: string) {
    return await this.imagesService.downloadEventImage(userId, destFileName)
  }

  @Get("downloadWidgetImage/:userId")
  async downloadWidgetImage(@Param() userId: string, @Query() destFileName: string) {
    return await this.imagesService.downloadWidgetImage(userId, destFileName)
  }

  @Delete('deleteProfileImage/:userId')
  async deleteProfileImage(@Param() userId: string) {
    return await this.imagesService.deleteProfileImage(userId)
  }

  @Delete('deletePostImage/:userId')
  async deletePostImage(@Param() userId: string) {
    return await this.imagesService.deletePostImage(userId)
  }

  @Delete('deleteGigImage/:userId')
  async deleteGigImage(@Param() userId: string) {
    return await this.imagesService.deleteGigImage(userId)
  }

  @Delete('deleteEventImage/:userId')
  async deleteEventImage(@Param() userId: string) {
    return await this.imagesService.deleteEventImage(userId)
  }
  
  @Delete('deleteWidgetImage/:userId')
  async deleteWidgetImage(@Param() userId: string) {
    return await this.imagesService.deleteWidgetImage(userId)
  }
}
