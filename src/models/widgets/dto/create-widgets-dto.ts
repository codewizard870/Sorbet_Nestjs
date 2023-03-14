import { ApiProperty } from "@nestjs/swagger";
// import { WidgetType } from "@prisma/client";
import { IsOptional } from "class-validator";

export class CreateWidgetDto {
  @IsOptional()
  @ApiProperty()
  username: string

  @IsOptional()
  @ApiProperty()
  url: string

  // @ApiProperty({
  //   description: "description of the Widget Type",
  //   enum: WidgetType,
  // })
  // type: WidgetType;

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
  nft_metadata: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  createdAt: Date

  @IsOptional()
  @ApiProperty()
  updatedAt: Date
}
