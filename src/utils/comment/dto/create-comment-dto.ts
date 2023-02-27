import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateCommentDto {
  @ApiProperty()
  text: string

  @ApiProperty()
  createdAt: Date

  @IsOptional()
  @ApiProperty()
  updatedAt: Date

  @IsOptional()
  @ApiProperty()
  eventId: string

  @IsOptional()
  @ApiProperty()
  gigId: string

  @IsOptional()
  @ApiProperty()
  postId: string
}
