import { ApiProperty } from "@nestjs/swagger";

export class CreateJobProfileDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;
}
