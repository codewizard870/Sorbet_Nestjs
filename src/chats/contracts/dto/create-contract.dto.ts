import { ApiProperty } from "@nestjs/swagger";

export class CreateContractDto {
  @ApiProperty()
  freelancerId: string
  @ApiProperty()
  clientId: string;
  @ApiProperty()
  jobTitle: string;
  @ApiProperty()
  jobDescription: string;
  @ApiProperty()
  startTime: string;
  @ApiProperty()
  budget: string;
}
