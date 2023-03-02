import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateCommentDto {
  @ApiProperty()
  content: string

  @ApiProperty()
  postId: string

  @ApiProperty()
  userId: string
}
