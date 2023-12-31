import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateNotificationDto {
  @IsOptional()
  @ApiProperty()
  type?: string

  @IsOptional()
  @ApiProperty()
  message?: string

  @IsOptional()
  @ApiProperty()
  link?: string

  @IsOptional()
  @ApiProperty({ default: false })
  read?: boolean

  @IsOptional()
  @ApiProperty()
  createdAt?: Date

  @IsOptional()
  @ApiProperty()
  readAt?: Date

  // relations
  @IsOptional()
  @ApiProperty()
  senderId?: string

  @IsOptional()
  @ApiProperty()
  receiverId?: string

  @IsOptional()
  @ApiProperty()
  postId?: string

  @IsOptional()
  @ApiProperty()
  commentId?: string

  @IsOptional()
  @ApiProperty()
  likeId?: string

  @IsOptional()
  @ApiProperty()
  followId?: string

  @IsOptional()
  @ApiProperty()
  chatId?: string

  @IsOptional()
  @ApiProperty()
  collabId?: string
}