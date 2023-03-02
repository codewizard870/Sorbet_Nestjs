import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateLikeDto {
  @ApiProperty()
  postId: string

  @ApiProperty()
  userId: string

}
