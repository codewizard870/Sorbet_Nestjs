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
@ApiTags("Collabs")
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

  @Get("findByUserId/:userId")
  findByUserId(@Param("userId") userId: string) {
    return this.collabService.findByUserId(userId)
  }

  @Get("findByWalletAddress/:walletAddress")
  findByWalletAddress(@Param("walletAddress") walletAddress: string) {
    return this.collabService.findByWalletAddress(walletAddress)
  }

  @Get("findByPublicKey/:publicKey")
  findByPublicKey(@Param("publicKey") publicKey: string) {
    return this.collabService.findByPublicKey(publicKey)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCollabDto: UpdateCollabDto) {
    return this.collabService.update(id, updateCollabDto)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.collabService.remove(id)
  }
}
