import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateCommentDto {
  @ApiProperty()
  content: string

  @ApiProperty()
  createdAt: Date

  @IsOptional()
  @ApiProperty()
  updatedAt: Date

  @IsOptional()
  @ApiProperty()
  postId: string
}
