import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  isVideo: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bucketName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  constructor(file: Express.Multer.File, isVideo: boolean, bucketName: string, userId: string) {
    this.file = file;
    this.isVideo = isVideo;
    this.bucketName = bucketName;
    this.userId = userId;
  }
}
