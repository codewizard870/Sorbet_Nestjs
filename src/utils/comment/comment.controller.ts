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
  @Controller("/comment")
  export class CommentController {
    constructor(private readonly commentService: CommentService) {}
  
    @Post('createPostComment')
    async createPostComment(@Body() createCommentDto: CreateCommentDto) {
      return await this.commentService.createPostComment(createCommentDto)
    }
  
    @Get('post/:postId/commments')
    async findAllCommentsForPost (@Param() postId: string) {
      return await this.commentService.findAllCommentsForPost(postId)
    }

    @Get(':id')
    async findOne (@Param() id: string) {
      return await this.commentService.findOne(id)
    }

    @Patch(':id/updateComment')
    async updateComment (@Param() id: string, @Body() updatedCommentDto: UpdateCommentDto) {
      return await this.commentService.updateComment(updatedCommentDto, id)
    }

    @Delete(':id/removeComment')
    async removeComment (@Param() id: string) {
      return await this.commentService.removeComment(id)
    }
  }
  