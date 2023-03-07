import {
  Controller,
  Get,
  Body,
  Request,
  Patch,
  Delete,
  Post,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("users")
@Controller("/api/user")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("createUser")
  async create(@Request() req, @Body() token: string) {
    return await this.usersService.create(req, token)
  }

  @Get("getAll")
  async getAll() {
    return await this.usersService.getAll();
  }

  @Get("getUserFromEmail")
  async getUserFromEmail(@Query("email") email: string) {
    return await this.usersService.getUserFromEmail(
      email
    )
  }

  @Get("getUserFromNearWallet")
  async getUserFromNearWallet(@Query("nearWallet") nearWallet: string) {
    return await this.usersService.getUserFromNearWallet(
      nearWallet
    )
  }

  @Get("getUserFromId")
  async getUserFromId(@Request() req) {
    return await this.usersService.getUserFromId(
      req.user.id
    )
  }

  @Patch('update')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUserProfile(
      req.user.id,
      updateUserDto
    )
  }

  @Delete("delete")
  deleteUser(@Request() req) {
    return this.usersService.delete(req.user.id);
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
  async addFollowerToUser(@Body("userId") userId: string, @Body("userToFollowId") userToFollowId: string) {
    return await this.usersService.addFollowerToUser(
      userId,
      userToFollowId
    )
  }

  @Post("removeFollowerFromUser")
  async removeFollowerFromUser(@Body("userId") userId: string, @Body("userToUnfollowId") userToUnfollowId: string) {
    return await this.usersService.removeFollowerFromUser(
      userId,
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

  @Get("getMutualConnections")
  async getMutualConnections(@Request() req, @Body() user2_Id: string) {
    return await this.usersService.connectionIntersection(
      req.user.id,
      user2_Id
    )
  }

  @Get("userRandomRecommendations")
  async userRandomRecommendations(@Query("userId") userId: string) {
    return await this.usersService.userRandomRecommendations(
      userId
    )
  }

  @Get("userRecommendations")
  async userRecommendations(@Query("userId") userId: string) {
    return await this.usersService.userRecommendations(
      userId
    )
  }
}
