import { Controller, Get, Post, Body, Request, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('users')
@Controller('/api/user')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('getAll')
  async getAll() {
    return await this.usersService.getAll();
  }


  @Patch()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUserProfile(req.user.id, updateUserDto);
  }

  @Delete('')
  deleteUser(@Request() req) {
    return this.usersService.delete(req.user.id);
  }


}