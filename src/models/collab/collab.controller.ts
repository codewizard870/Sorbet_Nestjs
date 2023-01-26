import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CollabService } from "./collab.service";
import { CreateCollabDto } from "./dto/create-collab.dto";
import { UpdateCollabDto } from "./dto/update-collab.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("events")
@Controller("/api/collab")
export class CollabController {
  constructor(private readonly collabService: CollabService) {}

  @Post()
  async create(@Body() createCollabDto: CreateCollabDto) {
    return await this.collabService.create(createCollabDto);
  }

  @Get()
  async findAll() {
    return await this.collabService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.collabService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCollabDto: UpdateCollabDto) {
    return this.collabService.update(id, updateCollabDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.collabService.remove(id);
  }
}
