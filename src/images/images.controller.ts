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
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Body() userId) {
    console.log(userId)
    return await this.imagesService.uploadProfileImage('image.png', userId)
  }

  @Post("uploadPostImage")
  @UseInterceptors(FileInterceptor("file"))
  async uploadPostImage(@UploadedFile() file: Express.Multer.File, @Body() body) {
    return await this.imagesService.uploadPostImage(file, body.userId)
  }

  @Post("uploadEventImage")
  @UseInterceptors(FileInterceptor("file"))
  async uploadEventImage(
    @UploadedFile() file: Express.Multer.File, @Body() body) {
    return await this.imagesService.uploadEventImage(file, body.userId)
  }

  @Post("uploadGigImage")
  @UseInterceptors(FileInterceptor("file"))
  async uploadGigImage(
    @UploadedFile() file: Express.Multer.File, @Body() body) {
    return await this.imagesService.uploadGigImage(file, body.userId)
  }


  @Post("uploadWidgetImage")
  // @UseInterceptors(FileInterceptor("file"))
  async uploadWidgetImage(
    @UploadedFile() file: Express.Multer.File, @Request() req) {
    console.log("req.user", req.user.id);
    return await this.imagesService.uploadWidgetImage(file, req.user.id)
  }

  @Get("downloadProfileImage")
  async downloadProfileImage(@Query("Name") name: string, @Query() userId) {
    console.log('name', name)
    console.log("userId", userId)
    return await this.imagesService.downloadProfileImage(name, userId)
  }

  @Get("downloadPostImage")
  async downloadPostImage(@Param("Name") name: string, @Query() userId) {
    console.log("userId", userId)
    return await this.imagesService.downloadPostImage(name, userId)
  }

  @Get("downloadGigImage")
  async downloadGigImage(@Param("Name") name: string, @Query() userId) {
    console.log("userId", userId)
    return await this.imagesService.downloadGigImage(name, userId)
  }

  @Get("downloadEventImage")
  async downloadEventImage(@Param("Name") name: string, @Query() userId) {
    console.log("userId", userId)
    return await this.imagesService.downloadEventImage(name, userId)
  }

  @Get("downloadWidgetImage")
  async downloadWidgetImage(@Param("Name") name: string, @Query() userId) {
    console.log("userId", userId)
    return await this.imagesService.downloadWidgetImage(name, userId)
  }
}
