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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CreateImageDto } from './dto/create-image.dto';
import { ApiFile, FileExtender } from 'src/utils/decorators';

@ApiBearerAuth()
@ApiTags("Images")
@Controller("/images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post("upload")
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        isVideo: { type: 'boolean' },
        bucketName: { type: 'string' },
        userId: { type: 'string' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async uploadFile
    (
      @Body() body: CreateImageDto,
      @UploadedFile() file: Express.Multer.File,
    ): Promise<{ fileUrl: string }> {
    return await this.imagesService.upload(file, body.bucketName, body.userId, body.isVideo);

  }

  @Get("getMetadata/:isVideo/:bucketName/:userId")
  async getMetadata(@Param("isVideo") isVideo: boolean, @Param("bucketName") bucketName: string, @Param("userId") userId: string): Promise<any> {
    return await this.imagesService.getMetadata(isVideo, bucketName, userId)
  }

  @Get("download/:isVideo/:bucketName/:userId")
  async downloadFile(@Param("isVideo") isVideo: boolean, @Param("bucketName") bucketName: string, @Param("userId") userId: string) {
    return await this.imagesService.download(isVideo, bucketName, userId)
  }

  @Delete('delete/:isVideo/:bucketName/:userId')
  async deleteFile(@Param("isVideo") isVideo: boolean, @Param("bucketName") bucketName: string, @Param("userId") userId: string) {
    return await this.imagesService.delete(isVideo, bucketName, userId)
  }
}
