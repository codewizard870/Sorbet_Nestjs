import { ApiProperty } from "@nestjs/swagger";
import { LocationType, PostType } from "@prisma/client";
import { IsOptional } from "class-validator";

export class CreatePostDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  imageUrl: string;

  @ApiProperty()
  @IsOptional()
  videoUrl: string;

  //Gig only
  @ApiProperty()
  @IsOptional()
  serviceType: LocationType;

  @ApiProperty()
  @IsOptional()
  category: string;

  @ApiProperty()
  @IsOptional()
  subCategory: string;

  @ApiProperty()
  @IsOptional()
  seachTags: string[];

  @ApiProperty()
  @IsOptional()
  salary: string;

  //event only
  @ApiProperty()
  @IsOptional()
  startDate: Date;

  @ApiProperty()
  @IsOptional()
  endDate: Date;

  @ApiProperty()
  @IsOptional()
  startTime: string;

  @ApiProperty()
  @IsOptional()
  endTime: string;

  @ApiProperty()
  @IsOptional()
  venue: string;

  @ApiProperty()
  @IsOptional()
  externalLink: string;

  @ApiProperty()
  postType: PostType;

  @ApiProperty()
  userId: string;
}
