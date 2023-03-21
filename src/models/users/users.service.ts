import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { filter } from "rxjs";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(address: string, email: string, token: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { nearWallet: address },
      })
      if (user) {
        throw new BadRequestException("User already Exists")
      }
      else {
        const result = await this.prisma.user.create({
          data: {
            nearWallet: address,
            firstName: null,
            lastName: null,
            title: null,
            email: email,
            bio: null,
            profileImage: null,
            confirmationCode: (Math.random() * 10000).toString(),
          },
        })
        if (result) {
          return result
        }
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getUserFromEmail(email: string) {
    try {
      const result = await this.prisma.user.findFirst({
        where: { email: email },
        include: { jobProfile: true, post: true, groups: true, location: true, widgets: true, followers: true, following: true, likes: true, comments: true },
      })
      if (result) {
        return result
      }
      else {
        console.log("Could not find user by email")
        return
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getUserFromNearWallet(nearWallet: string) {
    try {
      const result = await this.prisma.user.findFirst({
        where: { nearWallet: nearWallet },
        include: { jobProfile: true, post: true, groups: true, location: true, widgets: true, followers: true, following: true, likes: true, comments: true },
      })
      if (result) {
        return result
      }
      else {
        console.log("Could not find user by near wallet address")
        throw new Error(`Could not find user by near wallet address: ${nearWallet}`);
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getUserFromId(id: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: id },
        include: { jobProfile: true, post: true, groups: true, location: true, widgets: true, followers: true, following: true, likes: true, comments: true },
      });
      return user;
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  }

  async getAll() {
    try {
      const allUsers = await this.prisma.user.findMany({
        include: { jobProfile: true, post: true, groups: true, location: true, widgets: true, followers: true, following: true, likes: true, comments: true },
      })
      if (allUsers) {
        return allUsers
      }
      else {
        console.log("Could not get all users")
        throw new Error("Could not get all users")
      }
    }
    catch (error) {
      console.log(`Error Occured, ${error}`);
      throw new Error("Error getting all users.")
    }
  }

  async updateUserProfile(id: string, data: any) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: id },
      })
      if (user) {
        const result = await this.prisma.user.update({
          where: { id: id },
          data: {
            nearWallet: data.nearWallet,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            bio: data.bio,
            profileImage: data.profileImage,
            profileBannerImage: data.profileBannerImage,
            tags: data.tags,
            updatedAt: new Date(Date.now())
          },
        });
        if (result) {
          return result
        }
        else {
          return { message: "Something went wrong" };
        }
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async remove(id: string) {
    try {
      const result = await this.prisma.user.delete({
        where: { id: id },
      });
      if (result) {
        return { message: "Deleted Successfully" };
      }
      else {
        return { message: "Something went wrong" };
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async addUserToGroup(userId: string, groupId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
        include: { groups: true }
      })
      const group = await this.prisma.group.findFirst({
        where: { id: groupId },
        include: { members: true }
      })
      if (user && group) {
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: {
            groupIDs: {
              push: group.id
            }
          }
        })
        const updatedGroup = await this.prisma.group.update({
          where: { id: groupId },
          data: {
            userIDs: {
              push: user.id
            }
          }
        })
        if (updatedUser && updatedGroup) {
          return { message: "Successfully Added to Group!" }
        }
        else {
          console.log("Could not update user or group arrays")
          throw new Error("Could not update user or group arrays")
        }
      }
      else {
        console.log("Could not find user or group.")
        throw new Error("Could not find user or group.")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async removeUserFromGroup(userId: string, groupId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
        include: { groups: true }
      })
      const group = await this.prisma.group.findFirst({
        where: { id: groupId },
        include: { members: true }
      })
      if (user && group) {
        // remove groupId from user groupIDs array
        const groups = user.groupIDs
        const index = groups.indexOf(groupId)
        const updatedGroupsArray = groups.splice(index, 1)
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: {
            groupIDs: updatedGroupsArray
          }
        })
        // remove userId from group userIDs array
        const users = group.userIDs
        const _index = users.indexOf(userId)
        const updatedUsersArray = users.splice(_index, 1)
        const updatedGroup = await this.prisma.group.update({
          where: { id: groupId },
          data: {
            userIDs: updatedUsersArray
          }
        })

        if (updatedUser && updatedGroup) {
          return { message: `Successfully removed user: ${user.firstName} ${user.lastName} from group ${group.name}` }
        }
        else {
          console.log("Could not update user or group arrays")
          throw new Error("Could not update user or group arrays")
        }
      }
      else {
        console.log("Could not find user or group.")
        throw new Error("Could not find user or group.")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async addConnectionRequestToUser(userId: string, userToConnectWithId: string) {
    try {
      if (userId && userToConnectWithId) {
        const userToConnectWith = await this.prisma.user.findFirst({
          where: { id: userId },
        })
        const connections = userToConnectWith.connections
        const connection_requests = userToConnectWith.connection_requests
        for (let i = 0; i < connections.length; i++) {
          if (connections[i] == userToConnectWithId) {
            console.log(`User is already connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}`)
            throw new Error(`User is already connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}`)
          }
        }
        for (let i = 0; i < connection_requests.length; i++) {
          if (connection_requests[i] == userToConnectWithId) {
            console.log(`User has already requested to connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}`)
            throw new Error(`User has already requested to connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}`)
          }
        }
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: {
            connection_requests: {
              push: userToConnectWithId
            }
          }
        })
        console.log('Added connection - updated user: ', updatedUser)
        if (updatedUser) {
          return { message: `Successfully sent connection request to ${userToConnectWith.firstName} ${userToConnectWith.lastName}` }
        }
        else {
          return { message: `Unable to send connection request to ${userToConnectWith.firstName} ${userToConnectWith.lastName}` }
        }
      }
      else {
        console.log("Missing userId or userToConnectWithId")
        throw new Error(`Missing userId or userToConnectWithId - userId: ${userId}, userToConnectWithId: ${userToConnectWithId}`)
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("Unable to send connection request to this user. Please try again.")
    }
  }

  async approveConnectionRequest(userId: string, userToConnectWithId: string) {
    try {
      if (userId && userToConnectWithId) {
        const user = await this.prisma.user.findFirst({
          where: { id: userId }
        })
        const userToConnectWith = await this.prisma.user.findFirst({
          where: { id: userToConnectWithId },
        })
        const connections = user.connections
        console.log('user connections', connections)
        const connection_requests = user.connection_requests
        console.log('connection_requests', connection_requests)
        for (let i = 0; i < connections.length; i++) {
          if (connections[i] == userToConnectWithId) {
            console.log(`User is already connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}`)
            throw new Error(`User is already connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}`)
          }
        }
        for (let i = 0; i < connection_requests.length; i++) {
          if (connection_requests[i] == userToConnectWithId) {
            const updatedConnectionRequestsArray = connection_requests.splice(i, 1)
            const updatedUserConnectionRequestsArray = await this.prisma.user.update({
              where: { id: userId },
              data: {
                connection_requests: updatedConnectionRequestsArray
              }
            })
            console.log('updatedUserConnectionRequestsArray', updatedUserConnectionRequestsArray)
            const updatedUserConnectionsArray = await this.prisma.user.update({
              where: { id: userId },
              data: {
                connections: {
                  push: userToConnectWithId
                }
              }
            })
            console.log('updatedUserConnectionsArray', updatedUserConnectionsArray)
            const updatedUserToConnectWithConnectionsArray = await this.prisma.user.update({
              where: { id: userToConnectWithId },
              data: {
                connections: {
                  push: userId
                }
              }
            })
            console.log('updatedUserToConnectWithConnectionsArray', updatedUserToConnectWithConnectionsArray)
            if (updatedUserConnectionRequestsArray && updatedUserConnectionsArray && updatedUserToConnectWithConnectionsArray) {
              return { message: `Successfully connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}` }
            }
            else {
              return { message: `Unable to connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}` }
            }
          }
          else {
            console.log(`User is already connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}`)
            throw new Error(`User is already connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}`)
          }
        }
        return `Successfully approved connection request to ${userToConnectWith.firstName} ${userToConnectWith.lastName}`
      }
      else {
        console.log('Missing userId or userToConnectWithId', `userId: ${userId}, userToConnectWithId: ${userToConnectWithId}`)
        throw new Error("Missing userId or userToConnectWithId")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("Unable to connect with this user. Please try again.")
    }
  }

  async removeConnection(userId: string, userToUnconnectWithId: string) {
    try {
      if (userId && userToUnconnectWithId) {
        const user = await this.prisma.user.findFirst({
          where: { id: userId }
        })
        const userToUnconnectWith = await this.prisma.user.findFirst({
          where: { id: userToUnconnectWithId }
        })
        if (user && userToUnconnectWith) {
          const connectionsArray = user.connections
          const index = connectionsArray.indexOf(userToUnconnectWithId)
          const updatedConnectionsArray = connectionsArray.splice(index, 1)
          const removedConnection = await this.prisma.user.update({
            where: { id: userId },
            data: {
              connections: updatedConnectionsArray
            }
          })
          const connectionsArray2 = userToUnconnectWith.connections
          const index2 = connectionsArray2.indexOf(userId)
          const updatedConnectionsArray2 = connectionsArray2.splice(index2, 1)
          const removedConnection2 = await this.prisma.user.update({
            where: { id: userToUnconnectWithId },
            data: {
              connections: updatedConnectionsArray2
            }
          })
          if (removedConnection && removedConnection2) {
            return { message: `Successfully removed connection between ${user.firstName} ${user.lastName} and ${userToUnconnectWith.firstName} ${userToUnconnectWith.lastName}` }
          }
        }
        else {
          console.log(`Could not find user by id: ${userId} or user2 by id: ${userToUnconnectWithId}`)
          throw new Error(`Could not find user by id: ${userId}`)
        }
      }
      else {
        console.log('Missing userId or userToUnconnectWithId')
        throw new Error("Missing userId or userToUnconnectWithId")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("Unable to remove this connection. Please try again.")
    }
  }

  async addFollowerToUser(userId: string, userToFollowId: string) {
    try {
      const user = await this.prisma.follow.findFirst({
        where: { fromUserId: userId, toUserId: userToFollowId }
      })
      if (user) {
        console.log("Failed to update user or userToFollow")
        return { message: `already followed from ${userId} to ${userToFollowId}` }
      }
      const follow =  await this.prisma.follow.create({
        data: { fromUserId: userId, toUserId: userToFollowId }
      })
      if (follow) {
        return follow
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("Unable to follow this user. Please try again.")
    }
  }

  async removeFollowerFromUser(userId: string, userToUnfollowId: string) {
    try {
      const user = await this.prisma.follow.findFirst({
        where: { fromUserId: userId, toUserId: userToUnfollowId }
      })
      if (!user) {
        console.log("Failed to update user or userToUnFollow")
        return { message: `not exising following from ${userId} to ${userToUnfollowId}` }
      }
      return await this.prisma.follow.deleteMany({
        where: { fromUserId: userId, toUserId: userToUnfollowId }
      })
    }
    catch (error) {
      console.log(error)
      throw new Error("Unable to unfollow this user. Please try again.")
    }
  }

  async followerIntersection(user1_Id: string, user2_Id: string) {
    try {
      const user1 = await this.prisma.user.findFirst({
        where: { id: user1_Id }, include: { followers: true }
      })

      const user2 = await this.prisma.user.findFirst({
        where: { id: user2_Id }, include: { followers: true }
      })

      if (user1 && user2) {
        const followers_user1 = user1.followers
        const followers_user2 = user2.followers
        const followersIntersection = followers_user1.filter(follower1 => followers_user2.find(follower2 => follower1.fromUserId == follower2.fromUserId))
        if (followersIntersection.length > 0) {
          return followersIntersection
        }
        else {
          console.log(`User: ${user1.firstName} ${user1.lastName} has no common followers with user: ${user2.firstName} ${user2.lastName}`)
          return { message: `User: ${user1.firstName} ${user1.lastName} has no common followers with user: ${user2.firstName} ${user2.lastName}` }
        }
      }
      else {
        console.log("Could not update user or userToFollow.")
        throw new Error("Could not update user or userToFollow.")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("Unable to check for mutual followers. Please try again.")
    }
  }

  async connectionIntersection(user1_Id: string, user2_Id: string) {
    try {
      const user1 = await this.prisma.user.findFirst({
        where: { id: user1_Id }
      })

      const user2 = await this.prisma.user.findFirst({
        where: { id: user2_Id }
      })

      if (user1 && user2) {
        const connections_user1 = user1.connections
        const connections_user2 = user2.connections
        const connectionsIntersection = connections_user1.filter(connection => connections_user2.includes(connection))
        if (connectionsIntersection.length > 0) {
          return connectionsIntersection
        }
        else {
          console.log(`User: ${user1.firstName} ${user1.lastName} has no common connections with user: ${user2.firstName} ${user2.lastName}`)
          return { message: `User: ${user1.firstName} ${user1.lastName} has no common connections with user: ${user2.firstName} ${user2.lastName}` }
        }
      }
      else {
        console.log("Could not find user1 or user2.")
        throw new Error("Could not find user1 or user2.")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("Unable to check for mutual connections. Please try again.")
    }
  }

  async userRandomRecommendations(userId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId }, include: { followers: true }
      })

      const userFollowers = user.followers
      const allUsers = await this.getAll()

      if (user && allUsers) {
        const filteredUsers = allUsers.filter(
          filterUser => (filterUser.id != userId) && !userFollowers.find(follower => filterUser.id == follower.fromUserId)
        )
        let recommendationsResult = []
        if (filteredUsers) {
          for (let i = 0; i < 3; i++) {
            const randomInt = Math.floor((filteredUsers.length - 1) * Math.random())
            const randomUser = filteredUsers[randomInt]
            if (randomUser) {
              recommendationsResult.push(randomUser)
              filteredUsers.splice(randomInt, 1)
            }
          }
        }
        return recommendationsResult
      }
      else {
        console.log("Could not get user or allUsers")
        throw new Error("Could not get user or allUsers")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("Unable to recommend users. Please try again.")
    }
  }

  // async userRecommendations(userId: string) {
  //   try {
  //     const user = await this.prisma.user.findFirst({
  //       where: { id: userId }, include: { followers: true }
  //     })
  //     const allUsers = await this.getAll()
  //     if (allUsers.length > 0) {
  //       let intersectionsCounts = []
  //       for (let i = 0; i < allUsers.length; i++) {
  //         const connectionIntersections = allUsers[i].connections.filter((connection: string) => user.connections.includes(connection))
  //         const followerIntersections = allUsers[i].followers.filter(follower1 => user.followers.find(follower2 => follower1.fromUserId == follower2.fromUserId))
  //         const totalIntersections = connectionIntersections.length + followerIntersections.length
  //         intersectionsCounts.push([allUsers[i].id, totalIntersections])
  //       }
  //       // sort array by most follower / connection intersections and return
  //       const mostMutual = intersectionsCounts
  //         .sort(([, a], [, b]) => b - a)
  //         .slice(0, 3)
  //       const recommendations = []
  //       if (mostMutual) {
  //         for (let i = 0; i < mostMutual.length; i++) {
  //           const _user = await this.prisma.user.findFirst({
  //             where: { id: mostMutual[i][0] }, include: { followers: true }
  //           })
  //           const filteredFollowers = _user.followers.filter(follower1 => !user.followers.find(follower2 => follower1.fromUserId == follower2.fromUserId))
  //           if (filteredFollowers.length > 0) {
  //             const getUser = await this.prisma.user.findFirst({
  //               where: { id: filteredFollowers[0].fromUserId }
  //             })
  //             recommendations.push(getUser)
  //           }
  //           else {
  //             return {
  //               message: `Could not retrieve recommendations for ${user.firstName} ${user.lastName} to follow.`,
  //             }
  //           }
  //         }
  //         return {
  //           message: `Recommendations for ${user.firstName} ${user.lastName} to follow.`,
  //           recommendations: recommendations
  //         }
  //       }
  //       else {
  //         console.log("Could not find the most mutual followers / connections")
  //         throw new Error("Could not find the most mutual followers / connections")
  //       }
  //       return
  //     }
  //     else {
  //       console.log(`Could not find any users.`)
  //       throw new Error(`Could not find any users.`)
  //     }
  //   }
  //   catch (error) {
  //     console.log(error)
  //     throw new Error("Unable to recommend users. Please try again.")
  //   }
  // }
}
