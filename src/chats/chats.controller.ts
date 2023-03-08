import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ChatsService } from "./chats.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";

@ApiBearerAuth()
@ApiTags("Chats")
@Controller("/swagger/chats")
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async create(@Body() createChatDto: CreateChatDto, @Request() req) {
    return await this.chatsService.create(createChatDto, req.user.id);
  }

  @Get()
  async findAll() {
    return await this.chatsService.getAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.chatsService.findOne(id);
  }

  @Get("findBycontactId/:contactId")
  async findByContactId(@Param("contactId") contactId: string) {
    return await this.chatsService.getChatByContactId(contactId);
  }

  @Get("findByuserId/:userId")
  async findByUserId(@Param("userId") userId: string) {
    return await this.chatsService.getChatByUserId(userId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateChatsDto: UpdateChatDto) {
    return this.chatsService.update(id, updateChatsDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.chatsService.remove(id);
  }

  @Get("searchMessages")
  async searchMessages(@Body() text: string) {
    return await this.chatsService.searchMessages(text)
  }
}
