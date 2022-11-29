import { ApiProperty } from "@nestjs/swagger";

export class FindEventDistanceDto {
  @ApiProperty()
  eventId: string;

  @ApiProperty()
  distance: number;
}

export class FindGigDistanceDto {
  @ApiProperty()
  gigId: string;

  @ApiProperty()
  distance: number;
}

export class FindPostDistanceDto {
  @ApiProperty()
  postId: string;

  @ApiProperty()
  distance: number;
}

export class FindUserDistanceDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  distance: number;
}
