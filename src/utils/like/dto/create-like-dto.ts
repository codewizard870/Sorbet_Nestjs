import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateLikeDto {
  @ApiProperty()
  createdAt: Date

  @IsOptional()
  @ApiProperty()
  postId: string
}
