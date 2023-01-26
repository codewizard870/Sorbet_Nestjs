import {
  Controller,
  Get,
  Body,
  Request,
  Patch,
  Delete,
  Post,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiTags("users")
@Controller("/api/user")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("createUser")
  async create(@Request() req, @Body() token: string) {
    return await this.usersService.create(req, token)
  }

  @Get("getAll")
  async getAll() {
    return await this.usersService.getAll();
  }

  @Patch()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUserProfile(
      req.user.id,
      updateUserDto
    );
  }

  @Delete("")
  deleteUser(@Request() req) {
    return this.usersService.delete(req.user.id);
  }
}
