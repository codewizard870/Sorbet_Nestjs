import { Controller,Request, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@ApiBearerAuth()
@ApiTags('Chats')
@Controller('/api/chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
 async create(@Body() createChatDto: CreateChatDto,@Request() req) {
    return await this.chatsService.create(createChatDto,req.user.id);
  }

  @Get()
 async findAll() {
    return await this.chatsService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
     return await this.chatsService.findOne(id);
   }

  @Get('findBycontactId/:contactId')
 async findBycontactId(@Param('contactId') contactId: string) {
    return await this.chatsService.getChatByContactId(contactId);
  }

  
  
  @Get('findByuserId/:contactId')
 async findByuserId(@Param('contactId') contactId: string) {
    return await this.chatsService.getChatByUserId(contactId);
  }


  @Delete(':id')
async  remove(@Param('id') id: string) {
    return await this.chatsService.remove(id);
  }
  
}