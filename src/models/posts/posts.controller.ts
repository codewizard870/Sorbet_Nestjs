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
import { PostType } from "@prisma/client";

@ApiBearerAuth()
@ApiTags("Posts")
@Controller("/posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post("create")
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto)
  }

  @Get("findAll")
  findAll() {
    return this.postsService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id)
  }

  @Get("findByUserId/:userId")
  findByUserId(@Param("userId") userId: string) {
    return this.postsService.findAllByUserId(userId)
  }

  @Get("findAllByPostType/:postType")
  findAllGigs(@Param("postType") postType: PostType) {
    return this.postsService.findPostsByPostType(postType)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto)
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.postsService.remove(id)
  }
}
