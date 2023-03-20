import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bucketName: string;

  @ApiProperty()
  userId: string;

  constructor(file: Express.Multer.File, bucketName: string, userId: string) {
    this.file = file;
    this.bucketName = bucketName;
    this.userId = userId;
  }
}
