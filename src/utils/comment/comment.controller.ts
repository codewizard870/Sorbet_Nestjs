import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request
  } from "@nestjs/common";
  import { CommentService } from "./comment.service";
  import { CreateCommentDto } from "./dto/create-comment-dto";
  import { UpdateCommentDto } from "./dto/update-comment-dto";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
  import { Public } from "src/utils/auth/constants";
  
  @ApiBearerAuth()
  @ApiTags("Comment")
  @Controller("/api")
  export class CommentController {
    constructor(private readonly commentService: CommentService) {}
  
    @Post('/post/createPostComment')
    async createPostComment(@Request() req, @Body() createCommentDto: CreateCommentDto) {
      return await this.commentService.createPostComment(createCommentDto, req.user.id)
    }
  
    @Post('/event/createEventComment')
    async createEventComment (@Request() req, @Body() createCommentDto: CreateCommentDto) {
      return await this.commentService.createEventComment(createCommentDto, req.user.id)
    }

    @Post('/gig/createGigComment')
    async createGigLike (@Request() req, @Body() createCommentDto: CreateCommentDto) {
      return await this.commentService.createGigComment(createCommentDto, req.user.id)
    }

    @Get('post/:postId/commments')
    async findAllCommentsForPost (@Param() postId: string) {
      return await this.commentService.findAllCommentsForPost(postId)
    }

    @Get('event/:eventId/comments')
    async findAllCommentsForEvent (@Param() eventId: string) {
      return await this.commentService.findAllCommentsForEvent(eventId)
    }

    @Get('gig/:gigId/commments')
    async findAllCommentsForGig (@Param() gigId: string) {
      return await this.commentService.findAllCommentsForGig(gigId)
    }

    @Get('comment/:id')
    async findOne (@Param() id: string) {
      return await this.commentService.findOne(id)
    }

    @Patch('comment/:id/updateComment')
    async updateComment (@Param() id: string, @Body() updatedCommentDto: UpdateCommentDto) {
      return await this.commentService.updateComment(updatedCommentDto, id)
    }

    @Delete('comment/:id/removeComment')
    async removeComment (@Param() id: string) {
      return await this.commentService.removeComment(id)
    }
  }
  