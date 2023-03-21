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
  async uploadImage
    (
      @Body() body: CreateImageDto,
      @UploadedFile() file: Express.Multer.File,
    ): Promise<{ imageUrl: string }> {
    return await this.imagesService.uploadImage(file, body.bucketName, body.userId);

  }

  @Get("getMetadata/:bucketName/:userId")
  async getMetadata(@Param("bucketName") bucketName: string, @Param("userId") userId: string): Promise<any> {
    return await this.imagesService.getImageMetadata(bucketName, userId)
  }

  @Get("download/:bucketName/:userId")
  async downloadImage(@Param("bucketName") bucketName: string, @Param("userId") userId: string) {
    return await this.imagesService.downloadImage(bucketName, userId)
  }

  @Delete('delete/:bucketName/:userId')
  async deleteImage(@Param("bucketName") bucketName: string, @Param("userId") userId: string) {
    return await this.imagesService.deleteImage(bucketName, userId)
  }
}
