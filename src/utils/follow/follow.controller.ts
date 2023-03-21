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
  import { FollowService } from "./follow.service";
  import { CreateFollowDto } from "./dto/create-follow-dto";
  import { UpdateFollowDto } from "./dto/update-follow-dto";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
  
  @ApiBearerAuth()
  @ApiTags("Follow")
  @Controller("/follow")
  export class FollowController {
    constructor(private readonly followService: FollowService) {}
  
    @Post('create')
    async create(@Body() createFollowDto: CreateFollowDto) {
      return await this.followService.createFollow(createFollowDto)
    }

    @Get('/findAll')
    async findAll () {
      return await this.followService.findAllFollows()
    }

    @Get(':id')
    async findOne (@Param("id") id: string) {
      return await this.followService.findById(id)
    }

    @Patch(':id')
    async update (@Param("id") id: string, @Body() updateFollowDto: UpdateFollowDto) {
      return await this.followService.updateFollow(updateFollowDto, id)
    }

    @Delete(':id')
    async remove (@Param("id") id: string) {
      return await this.followService.removeFollow(id)
    }
  }
  