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
  
    @Post('create')
    async create(@Body() createCommentDto: CreateCommentDto) {
      return await this.commentService.createComment(createCommentDto)
    }
  
    @Get('comments/:postId')
    async findAllForPost (@Param("postId") postId: string) {
      return await this.commentService.findAllCommentsForPost(postId)
    }

    @Get('/findAll')
    async findAll () {
      return await this.commentService.findAllComments()
    }

    @Get(':id')
    async findOne (@Param("id") id: string) {
      return await this.commentService.findById(id)
    }

    @Patch(':id')
    async update (@Param("id") id: string, @Body() updatedCommentDto: UpdateCommentDto) {
      return await this.commentService.updateComment(updatedCommentDto, id)
    }

    @Delete(':id')
    async remove (@Param("id") id: string) {
      return await this.commentService.removeComment(id)
    }
  }
  