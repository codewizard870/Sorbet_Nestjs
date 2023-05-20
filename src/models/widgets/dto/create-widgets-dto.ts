import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateWidgetDto {
  @IsOptional()
  @ApiProperty()
  username: string

  @IsOptional()
  @ApiProperty()
  url: string

  @IsOptional()
  @ApiProperty()
  name: string

  @IsOptional()
  @ApiProperty()
  description: string

  @IsOptional()
  @ApiProperty()
  type: string

  @IsOptional()
  @ApiProperty()
  image: string

  @IsOptional()
  @ApiProperty()
  nftMetadata: string

  @IsOptional()
  @ApiProperty()
  oauthToken: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  createdAt: Date

  @IsOptional()
  @ApiProperty()
  updatedAt: Date
}
