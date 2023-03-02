import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateLikeDto } from "src/utils/like/dto/create-like-dto";
import { CreateCommentDto } from "src/utils/comment/dto/create-comment-dto";
import { UpdateCommentDto } from "src/utils/comment/dto/update-comment-dto";
@ApiBearerAuth()
@ApiTags("posts")
@Controller("/api/posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
    return await this.postsService.create(createPostDto)
  }

  @Get()
  findAll() {
    return this.postsService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.postsService.remove(id)
  }

  @Post('likePost')
  likePost(@Body() data: CreateLikeDto) {
    return this.postsService.likePost(data)
  }

  @Post('removeLikePost')
  removeLikePost(@Body("postId") postId: string, @Body("userId") userId: string) {
    return this.postsService.removeLikeFromPost(postId, userId)
  }

  @Post('commentOnPost')
  commentOnPost(@Body() data: CreateCommentDto) {
    return this.postsService.commentOnPost(data)
  }

  @Patch('updatePostComment')
  updatePostComment(@Body() data: UpdateCommentDto, commentId: string) {
    return this.postsService.updatePostComment(data, commentId)
  }

  @Delete('removeCommentFromPost')
  removeCommentFromPost(@Body("postId") postId: string, @Body("commentId") commentId: string) {
    return this.postsService.removeCommentFromPost(postId, commentId)
  }
}
