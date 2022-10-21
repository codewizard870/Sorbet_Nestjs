import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('users')
@Controller('/api/user')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Get('getAll')
async getAll(){
return await this.usersService.getAll();
}


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUserProfile(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string,) {
    return this.usersService.delete(id);
  }


}
