import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bucketName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  constructor(file: Express.Multer.File, fileType: string, bucketName: string, userId: string) {
    this.file = file;
    this.fileType = fileType;
    this.bucketName = bucketName;
    this.userId = userId;
  }
}
