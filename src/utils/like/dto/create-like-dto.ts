import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateLikeDto {
  @ApiProperty()
  createdAt: Date

  // @IsOptional()
  // @ApiProperty()
  // userId: string

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
