import { ApiProperty } from "@nestjs/swagger";
import { WidgetType } from "@prisma/client";
import { IsOptional } from "class-validator";

export class CreateWidgetDto {
  @IsOptional()
  @ApiProperty()
  name: string

  @IsOptional()
  @ApiProperty()
  description: string

  @ApiProperty({
    description: "description of the Widget Type",
    enum: WidgetType,
  })
  type: WidgetType;

  @ApiProperty()
  image: string

  @ApiProperty()
  nft_metadata: string

  @ApiProperty()
  project_link: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  createdAt: Date

  @IsOptional()
  @ApiProperty()
  updatedAt: Date
}
