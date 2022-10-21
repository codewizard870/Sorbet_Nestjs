import { ApiProperty } from "@nestjs/swagger";
import { LocationType } from "@prisma/client";
import { IsOptional } from "class-validator";

export class CreateLocationDto {
   
    @ApiProperty({
        description: 'description of the Location Type ',
        enum: LocationType,
      })
    location_type: LocationType

    @ApiProperty()
    Latitude :string
    @ApiProperty()
    Langitude :string
    
    @ApiProperty()
    @IsOptional()
    eventId: string
      
    
    @ApiProperty()
    @IsOptional()
    gigId: string
      
}
