import { ApiProperty } from "@nestjs/swagger";
import { LocationType } from "@prisma/client";
import { IsOptional } from "class-validator";

export class CreateLocationDto {
  @ApiProperty()
  locationType: LocationType;

  @ApiProperty()
  address: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  langitude: number;
  
  @ApiProperty()
  @IsOptional()
  postId: string;
}
