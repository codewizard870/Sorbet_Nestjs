import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { GigsService } from "./gigs.service";
import { CreateGigDto } from "./dto/create-gig.dto";
import { UpdateGigDto } from "./dto/update-gig.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateLikeDto } from "src/utils/like/dto/create-like-dto";
import { CreateCommentDto } from "src/utils/comment/dto/create-comment-dto";
import { UpdateCommentDto } from "src/utils/comment/dto/update-comment-dto";

@ApiBearerAuth()
@ApiTags("Gigs")
@Controller("/api/gigs")
export class GigsController {
  constructor(private readonly gigsService: GigsService) {}

  @Post()
  async create(@Body() createGigDto: CreateGigDto) {
    return await this.gigsService.create(createGigDto)
  }

  @Get()
  async findAll() {
    return await this.gigsService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.gigsService.findOne(id)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGigDto: UpdateGigDto) {
    return this.gigsService.update(id, updateGigDto)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.gigsService.remove(id)
  }

  @Post('likeGig')
  likeGig(@Body() data: CreateLikeDto, @Body() userId: string) {
    return this.gigsService.likeGig(data, userId)
  }

  @Delete('removeLikeFromGig')
  removeLikeFromGig(@Body() postId: string, likeId: string) {
    return this.gigsService.removeLikeFromGig(postId, likeId)
  }

  @Post('commentOnGig')
  commentOnGig(@Body() data: CreateCommentDto, commentId: string) {
    return this.gigsService.commentOnGig(data, commentId)
  }

  @Patch('updateGigComment')
  updateGigComment(@Body() data: UpdateCommentDto, commentId: string) {
    return this.gigsService.updateGigComment(data, commentId)
  }

  @Delete('removeCommentFromGig')
  removeCommentFromGig(@Body() postId: string, commentId: string) {
    return this.gigsService.removeCommentFromGig(postId, commentId)
  }
}
