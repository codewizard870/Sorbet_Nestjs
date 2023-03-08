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
  import { LikeService } from "./like.service";
  import { CreateLikeDto } from "./dto/create-like-dto";
  import { UpdateLikeDto } from "./dto/update-like-dto";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
  import { Public } from "src/utils/auth/constants";
  
  @ApiBearerAuth()
  @ApiTags("Like")
  @Controller("/swagger")
  export class LikeController {
    constructor(private readonly likeService: LikeService) {}
  
    @Post('like/createPostLike')
    async createPostLike(@Body() createLikeDto: CreateLikeDto) {
      console.log(CreateLikeDto)
      return await this.likeService.createPostLike(createLikeDto)
    }
  
    @Get('like/:postId/likes')
    async findAllLikesForPost (@Param() postId: string) {
      return await this.likeService.findAllLikesForPost(postId)
    }

    @Get('like/:id')
    async findOne (@Param() id: string) {
      return await this.likeService.findOne(id)
    }

    @Delete('like/remove')
    async removeLike (@Param() id: string) {
      return await this.likeService.removeLike(id)
    }
  }
  