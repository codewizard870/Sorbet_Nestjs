import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  Request,
  Body,
  UseInterceptors,
} from "@nestjs/common";
import { ImagesService } from "./images.service";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiBearerAuth()
@ApiTags("images")
@Controller("/images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post("uploadProfileImage")
  // @UseInterceptors(FileInterceptor("file"))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    return await this.imagesService.uploadProfileImage(file, req.user.id);
  }

  @Post("uploadPostImage")
  @UseInterceptors(FileInterceptor("file"))
  async uploadPostImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body
  ) {
    return await this.imagesService.uploadPostImage(file, body.userId);
  }

  @Post("uploadWidgetImage")
  // @UseInterceptors(FileInterceptor("file"))
  async uploadWidgetImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    console.log("req.user", req.user.id);
    return await this.imagesService.uploadWidgetImage(file, req.user.id);
  }

  @Get("download/:Key")
  async downloadImage(@Param("Key") Key: string, @Request() req) {
    console.log("req.user", req.user.id);
    return await this.imagesService.downloadProfileImage(Key, req.user.id);
  }
}
