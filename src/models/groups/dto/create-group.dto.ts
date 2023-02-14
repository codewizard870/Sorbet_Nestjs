import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateGroupDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  @IsOptional()
  description: string

  @ApiProperty()
  @IsOptional()
  image: string

  @ApiProperty()
  group_owner: string

  @ApiProperty()
  userIDs: string[]

  // @ApiProperty()
  // members: []

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
