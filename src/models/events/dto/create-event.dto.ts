import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {
  @ApiProperty()
  postId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  event_image: string;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty()
  timezone: Date;

  @ApiProperty()
  event_link: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  likes: string;
}
