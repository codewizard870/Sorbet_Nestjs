import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public } from "src/utils/auth/constants";

@ApiBearerAuth()
@ApiTags("Groups")
@Controller("/groups")
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post("create")
  async create(@Body() createGroupDto: CreateGroupDto, userId: string) {
    return await this.groupsService.create(createGroupDto, userId)
  }

  @Get("findAll")
  async findAll() {
    return await this.groupsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(":id/update")
  update(@Param("id") id: string, @Body() updateGigDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGigDto);
  }

  @Delete(":id/remove")
  remove(@Param("id") id: string) {
    return this.groupsService.remove(id);
  }
}
