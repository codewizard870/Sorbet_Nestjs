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
        fileType: { type: 'string' },
        bucketName: { type: 'string' },
        userId: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async uploadFile
    (
      @Body() body: CreateImageDto,
      @UploadedFile() file: Express.Multer.File,
    ): Promise<{ fileUrl: string }> {
    return await this.imagesService.upload(file, body.fileType, body.bucketName, body.userId);

  }

  @Get("getMetadata/:fileType/:bucketName/:userId")
  async getMetadata(@Param("fileType") fileType: string, @Param("bucketName") bucketName: string, @Param("userId") userId: string): Promise<any> {
    return await this.imagesService.getMetadata(fileType, bucketName, userId)
  }

  @Get("download/:fileType/:bucketName/:userId")
  async downloadFile(@Param("fileType") fileType: string, @Param("bucketName") bucketName: string, @Param("userId") userId: string) {
    return await this.imagesService.download(fileType, bucketName, userId)
  }

  @Delete('delete/:fileType/:bucketName/:userId')
  async deleteFile(@Param("fileType") fileType: string, @Param("bucketName") bucketName: string, @Param("userId") userId: string) {
    return await this.imagesService.delete(fileType, bucketName, userId)
  }
}
