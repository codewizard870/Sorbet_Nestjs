import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  Body,
  UseInterceptors,
  Query,
  Delete,
} from "@nestjs/common";
import { ImagesService } from "./images.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

// @ApiBearerAuth()
@ApiTags("Images")
@Controller("/images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(@UploadedFile("file") file: Express.Multer.File, @Body("bucketName") bucketName: string, @Body("userId") userId: string) {
    return await this.imagesService.uploadImage(file, bucketName, userId)
  }

  @Get("getMetadata/:bucketName/:userId")
  async getMetadata(@Param("bucketName") bucketName: string, @Param("userId") userId: string, @Query() destFileName: string) {
    return await this.imagesService.getImageMetadata(bucketName, userId)
  }

  @Get("download/:bucketName/:userId")
  async downloadImage(@Param("bucketName") bucketName: string, @Param("userId") userId: string, @Query() destFileName: string) {
    return await this.imagesService.downloadImage(bucketName, userId, destFileName)
  }

  @Delete('delete/:bucketName/:userId')
  async deleteImage(@Param("bucketName") bucketName: string, @Param("userId") userId: string) {
    return await this.imagesService.deleteImage(bucketName, userId)
  }
}
