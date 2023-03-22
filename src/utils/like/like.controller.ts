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
  @Controller("/like")
  export class LikeController {
    constructor(private readonly likeService: LikeService) {}
  
    @Post('/create')
    async create(@Body() createLikeDto: CreateLikeDto) {
      return await this.likeService.createLike(createLikeDto)
    }

    @Get('/findAll')
    async findAll() {
      return await this.likeService.findAll()
    }
  
    @Get('findAll/:postId')
    async findAllForPost(@Param("postId") postId: string) {
      return await this.likeService.findAllLikesForPost(postId)
    }

    @Get('/findAll/:userId')
    async findAllForUser(@Param("userId") userId: string) {
      return await this.likeService.findAllLikesForUser(userId)
    }

    @Get('/:id')
    async findOne(@Param("id") id: string) {
      return await this.likeService.findOne(id)
    }

    @Delete(':id')
    async delete(@Param("id") id: string) {
      return await this.likeService.remove(id)
    }
  }
  