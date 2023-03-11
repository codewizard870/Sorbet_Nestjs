import {
  Controller,
  Get,
  Body,
  Request,
  Patch,
  Delete,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("users")
@Controller("/user")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("create")
  async create(@Body() address: string, @Body() token: string) {
    return await this.usersService.create(address, token)
  }

  @Get("getAll")
  async getAll() {
    return await this.usersService.getAll()
  }

  @Get("/getUserByEmail/:email")
  async getUserFromEmail(@Param("email") email: string) {
    return await this.usersService.getUserFromEmail(
      email
    )
  }

  @Get("getUserByNearWallet/:nearWallet")
  async getUserFromNearWallet(@Param("nearWallet") nearWallet: string) {
    return await this.usersService.getUserFromNearWallet(
      nearWallet
    )
  }

  @Get("getUserById/:id")
  async getUserFromId(@Param("id") id: string) {
    return await this.usersService.getUserFromId(
      id
    )
  }

  @Patch(":id/update")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUserProfile(
      id,
      updateUserDto
    )
  }

  @Delete(":id/delete")
  deleteUser(@Param("id") id: string) {
    return this.usersService.delete(id);
  }

  @Patch("addUserToGroup")
  async addUserToGroup(@Request() req, @Body() groupId: string) {
    return await this.usersService.addUserToGroup(
      req.user.id,
      groupId
    )
  }

  @Patch("removeUserFromGroup")
  async removeUserFromGroup(@Request() req, @Body() groupId: string) {
    return await this.usersService.removeUserFromGroup(
      req.user.id,
      groupId
    )
  }

  @Patch("addConnectionRequestToUser")
  async addConnectionRequestToUser(@Request() req, @Body() userToConnectWithId: string) {
    return await this.usersService.addConnectionRequestToUser(
      req.user.id,
      userToConnectWithId
    )
  }

  @Patch("approveConnectionRequest")
  async approveConnectionRequest(@Request() req, @Body() userToConnectWithId: string) {
    return await this.usersService.approveConnectionRequest(
      req.user.id,
      userToConnectWithId
    )
  }

  @Patch("removeConnection")
  async removeConnection(@Request() req, @Body() userToUnconnectWithId: string) {
    return await this.usersService.removeConnection(
      req.user.id,
      userToUnconnectWithId
    )
  }

  @Post("addFollowerToUser")
  async addFollowerToUser(@Request() req, @Body("userToFollowId") userToFollowId: string) {
    return await this.usersService.addFollowerToUser(
      req.user.id,
      userToFollowId
    )
  }

  @Post("removeFollowerFromUser")
  async removeFollowerFromUser(@Request() req, @Body("userToUnfollowId") userToUnfollowId: string) {
    return await this.usersService.removeFollowerFromUser(
      req.user.id,
      userToUnfollowId
    )
  }

  @Get("getMutualFollowers")
  async getMutualFollowers(@Request() req, @Body() user2_Id: string) {
    return await this.usersService.followerIntersection(
      req.user.id,
      user2_Id
    )
  }

  @Get(":getMutualConnections")
  async getMutualConnections(@Request() req, @Body() user2_Id: string) {
    return await this.usersService.connectionIntersection(
      req.user.id,
      user2_Id
    )
  }

  @Get("userRandomRecommendations")
  async userRandomRecommendations(@Request() req) {
    return await this.usersService.userRandomRecommendations(
      req.user.id
    )
  }

  @Get("userRecommendations")
  async userRecommendations(@Request() req) {
    return await this.usersService.userRecommendations(
      req.user.id
    )
  }
}
