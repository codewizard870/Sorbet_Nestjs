import { ApiProperty } from "@nestjs/swagger";
import { LocationType } from "@prisma/client";
import { IsOptional } from "class-validator";

export class CreateLocationDto {
  @ApiProperty({
    description: "description of the Location Type ",
    enum: LocationType,
  })
  location_type: LocationType;

  @ApiProperty()
  country: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  @IsOptional()
  eventId: string;

  @ApiProperty()
  @IsOptional()
  gigId: string;

  @ApiProperty()
  @IsOptional()
  postId: string;
}

export class CreateMyLocationDto {
  @ApiProperty({
    description: "description of the Location Type ",
    enum: LocationType,
  })
  location_type: LocationType;

  @ApiProperty()
  country: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  city: string;
}
