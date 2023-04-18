import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateApplyDto {
  @ApiProperty()
  type: string

  @ApiProperty()
  appliedUserId: string

  @ApiProperty()
  gigId: string
}