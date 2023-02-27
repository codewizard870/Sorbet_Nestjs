import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateLikeDto } from "src/utils/like/dto/create-like-dto";
import { CreateCommentDto } from "src/utils/comment/dto/create-comment-dto";
import { UpdateCommentDto } from "src/utils/comment/dto/update-comment-dto";

@ApiBearerAuth()
@ApiTags("events")
@Controller("/api/events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return await this.eventsService.create(createEventDto);
  }

  @Get()
  async findAll() {
    return await this.eventsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.eventsService.remove(id);
  }

  @Post('likeEvent')
  likeEvent(@Body() data: CreateLikeDto, @Body() userId: string) {
    return this.eventsService.likeEvent(data, userId)
  }

  @Delete('removeLikeFromEvent')
  removeLikeFromEvent(@Body() postId: string, likeId: string) {
    return this.eventsService.removeLikeFromEvent(postId, likeId)
  }

  @Post('commentOnEvent')
  commentOnEvent(@Body() data: CreateCommentDto, commentId: string) {
    return this.eventsService.commentOnEvent(data, commentId)
  }

  @Patch('updateEventComment')
  updateEventComment(@Body() data: UpdateCommentDto, commentId: string) {
    return this.eventsService.updateEventComment(data, commentId)
  }

  @Delete('removeCommentFromEvent')
  removeCommentFromEvent(@Body() postId: string, commentId: string) {
    return this.eventsService.removeCommentFromEvent(postId, commentId)
  }
}
