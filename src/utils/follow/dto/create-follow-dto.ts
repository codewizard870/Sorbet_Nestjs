import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateFollowDto {
  @ApiProperty()
  fromUserId: string

  @IsOptional()
  @ApiProperty()
  toUserId: string

  @IsOptional()
  @ApiProperty()
  toPostId: string
}