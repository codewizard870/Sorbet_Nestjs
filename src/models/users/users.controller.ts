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
  Put,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiTags, ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
import { CreateWidgetDto } from "../widgets/dto/create-widgets-dto";


@ApiTags("Users")
@Controller("/user")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("create")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string' },
        token: { type: 'string' }
      },
    },
  })
  async create(@Body("address") address: string, @Body("token") token: string) {
    return await this.usersService.create(address, null, token)
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

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUserProfile(
      id,
      updateUserDto
    )
  }

  @Patch("addUserToGroup")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        groupId: { type: 'string' }
      },
    },
  })
  async addUserToGroup(@Body('userId') userId: string, @Body("groupId") groupId: string) {
    return await this.usersService.addUserToGroup(
      userId,
      groupId
    )
  }

  @Patch("removeUserFromGroup")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        groupId: { type: 'string' }
      },
    },
  })
  async removeUserFromGroup(@Body('userId') userId: string, @Body() groupId: string) {
    return await this.usersService.removeUserFromGroup(
      userId,
      groupId
    )
  }

  @Patch("addConnectionRequestToUser")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        userToConnectWithId: { type: 'string' }
      },
    },
  })
  async addConnectionRequestToUser(@Body('userId') userId, @Body('userToConnectWithId') userToConnectWithId: string) {
    return await this.usersService.addConnectionRequestToUser(
      userId,
      userToConnectWithId
    )
  }

  @Patch("approveConnectionRequest")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        userToConnectWithId: { type: 'string' }
      },
    },
  })
  async approveConnectionRequest(@Body('userId') userId, @Body('userToConnectWithId') userToConnectWithId: string) {
    return await this.usersService.approveConnectionRequest(
      userId,
      userToConnectWithId
    )
  }

  @Patch("removeConnection")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        userToUnconnectWithId: { type: 'string' }
      },
    },
  })
  async removeConnection(@Body('userId') userId, @Body('userToUnconnectWithId') userToUnconnectWithId: string) {
    return await this.usersService.removeConnection(
      userId,
      userToUnconnectWithId
    )
  }

  @Post("addFollowerToUser")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        userToFollowId: { type: 'string' }
      },
    },
  })
  async addFollowerToUser(@Body("userId") userId: string, @Body("userToFollowId") userToFollowId: string) {
    return await this.usersService.addFollowerToUser(
      userId,
      userToFollowId
    )
  }


  @Delete("removeFollowerFromUser")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        userToUnfollowId: { type: 'string' }
      },
    },
  })
  async removeFollowerFromUser(@Body("userId") userId: string, @Body("userToUnfollowId") userToUnfollowId: string) {
    return await this.usersService.removeFollowerFromUser(
      userId,
      userToUnfollowId
    )
  }

  @Get("getMutualFollowers/:userId/:user2Id")
  async getMutualFollowers(@Param("userId") userId: string, @Param('user2Id') user2Id: string) {
    return await this.usersService.followerIntersection(
      userId,
      user2Id
    )
  }

  @Get("getMutualConnections/:userId/:user2Id")
  async getMutualConnections(@Param("userId") userId: string, @Param('user2Id') user2Id: string) {
    return await this.usersService.connectionIntersection(
      userId,
      user2Id
    )
  }

  @Get("userRandomRecommendations")
  async userRandomRecommendations(@Query("userId") userId: string) {
    return await this.usersService.userRandomRecommendations(
      userId
    )
  }

  @Get("getUserFromUserId/:userId")
  async getUserFromUserId(@Param("userId") userId: string) {
    return await this.usersService.getUserFromUserId(
      userId
    )
  }

  @Delete('deleteUserAvatar/:userId')
  async deleteUserAvatar(@Param("userId") userId: string) {
    return await this.usersService.deleteUserAvatar(userId)
  }
}
