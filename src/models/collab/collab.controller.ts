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
@Controller("/collab")
export class CollabController {
  constructor(private readonly collabService: CollabService) {}

  @Post("create")
  async create(@Body() createCollabDto: CreateCollabDto) {
    return await this.collabService.create(createCollabDto)
  }

  @Get("findAll")
  async findAll() {
    return await this.collabService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.collabService.findOne(id)
  }

  @Get("findByUserId")
  findByUserId(@Body() userId: string) {
    return this.collabService.findByUserId(userId)
  }

  @Get("findByWalletAddress")
  findByWalletAddress(@Body() walletAddress: string) {
    return this.collabService.findByWalletAddress(walletAddress)
  }

  @Get("findByPublicKey")
  findByPublicKey(@Body() publicKey: string) {
    return this.collabService.findByPublicKey(publicKey)
  }

  @Patch(":id/update")
  update(@Param("id") id: string, @Body() updateCollabDto: UpdateCollabDto) {
    return this.collabService.update(id, updateCollabDto)
  }

  @Delete(":id/delete")
  remove(@Param("id") id: string) {
    return this.collabService.remove(id)
  }
}
