import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  Request,
  // UseInterceptors,
} from "@nestjs/common";
import { ImagesService } from "./images.service";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiBearerAuth()
@ApiTags("images")
@Controller("/api/images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post("uploadProfileImage")
  // @UseInterceptors(FileInterceptor("file"))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    console.log("req.user", req.user.id);
    return await this.imagesService.uploadProfileImage(file, req.user.id);
  }

  @Post("uploadGigImage")
  // @UseInterceptors(FileInterceptor("file"))
  async uploadGigImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    console.log("req.user", req.user.id);
    return await this.imagesService.uploadGigImage(file, req.user.id);
  }

  @Post("uploadEventImage")
  // @UseInterceptors(FileInterceptor("file"))
  async uploadEventImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    console.log("req.user", req.user.id);
    return await this.imagesService.uploadEventImage(file, req.user.id);
  }

  @Get("download/:Key")
  async downloadImage(@Param("Key") Key: string, @Request() req) {
    console.log("req.user", req.user.id);
    return await this.imagesService.downloadProfileImage(Key, req.user.id);
  }
}
