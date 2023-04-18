import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateAttendDto {
  @ApiProperty()
  type: string

  @ApiProperty()
  attendingUserId: string

  @ApiProperty()
  eventId: string
}