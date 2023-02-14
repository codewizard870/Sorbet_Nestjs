import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PasswordsService } from "src/utils/passwords/passwords.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordsService: PasswordsService
  ) {}

  async create(data: any, token: string) {
    try {
      const user = await this.getUserFromEmail(data.email);
      if (user) {
        throw new BadRequestException("User already Exists");
      } 
      else {
        const pass = await this.passwordsService.hashPassword(data.password);
        data.password = pass;
        const result = await this.prisma.user.create({
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            jobProfile: data.jobProfile,
            location: data.location,
            bio: data.bio,
            status: data.Status,
            profileImage: null,
            confirmationCode: token,
            // magicAuth: false,
          },
        });
        if (result) {
          return result;
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
        where: {
          email: email,
        },
      });
      if (result) {  
        return result;
      } 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async verifyUserEmail(email: string) {
    try {
      const result = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          status: "Active",
        },
      });
      if (result) {
        return { message: "Email verified" };
      } else {
        throw new BadRequestException("Unable to verify Email");
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getUserFromId(_id: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: _id },
        include: { jobProfile: true, location: true },
      });
      return user;
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async getAll() {
    try {
      const allUsers = await this.prisma.user.findMany({
        //   select: {
        //   id: true,
        //   email: true,
        //   firstName: true,
        //   lastName: true,
        //   jobProfile: true,
        //   location: true,
        //   bio: true,
        //   profileImage: true,
        // },
      });
      return allUsers;
    } 
    catch (error) {
      console.log(`Error Occured, ${error}`);
      throw new Error("Error getting all users.")
    }
  }

  async getUserFromConfirmationCode(confirmationCode: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          confirmationCode: confirmationCode,
        },
      });
      return user;
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async updateUserVerification(data: any) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: data.email },
      });
      if (user) {
        const result = await this.prisma.user.update({
          where: { email: data.email },
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            jobProfile: data.jobProfile,
            location: data.location,
            bio: data.bio,
            status: data.Status,
            profileImage: data.profileImage,
            confirmationCode: data.confirmationCode,
            // magicAuth: true,
          },
        });
        if (result) {
          return { message: "User magic verification updated successfully!" };
        } 
        else {
          return { message: "Unable to update user magic verification." };
        }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Unable to update user magic verification. Please try again.")
    }
  }

  async updateUserProfile(_id: string, data: any) {
    try {
      const result = await this.prisma.user.update({
        where: { id: _id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          jobProfile: data.jobProfile,
          location: data.location,
          bio: data.bio,
          status: data.Status,
          profileImage: data.profileImage,
          confirmationCode: data.confirmationCode,
        },
      });
      if (result) {
        return { message: "Update Successfully" };
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

  async delete(_id: string) {
    try {
      const result = await this.prisma.user.delete({
        where: { id: _id },
      });
      if (result) {
        return { message: "deleted Successfully" };
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

  async validateUser(email: string, pass: string) {
    try {
      const user1 = await this.prisma.user.findFirst({
        where: { email: email },
      });
      if (!user1) {
        throw new UnauthorizedException("Email/password incorrect");
      } else if (user1.status === "Pending") {
        throw new UnauthorizedException({
          message: "Pending Account. Please Verify Your Email!",
        });
      } else if (user1.status !== "Active") {
        throw new UnauthorizedException({ message: "Unauthorized!" });
      } else {
        const isMatch = await this.passwordsService.comparePassword(
          pass,
          user1.password
        );
        if (!isMatch) {
          throw new UnauthorizedException("Email/password incorrect");
        } else {
          const { password, ...user } = user1;
          return user;
        }
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
      if(user && group) {
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
        if (updatedUser) {
          return { message:  `Successfully sent connection request to ${userToConnectWith.firstName} ${userToConnectWith.lastName}`}
        }
        else {
          return { message:  `Unable to send connection request to ${userToConnectWith.firstName} ${userToConnectWith.lastName}`}
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
              where: {id: userId },
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
              console.log('userToConnectWith', userToConnectWith)
              return { message:  `Successfully connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}`}
            }
            else {
              return { message:  `Unable to connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}`}
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
          if(removedConnection && removedConnection2) {
            return { message: `Successfully removed connection between ${user.firstName} ${user.lastName} and ${userToUnconnectWith.firstName} ${userToUnconnectWith.lastName}` }
          }
        }
        else{
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
      if (userId && userToFollowId) {
        const user = await this.prisma.user.findFirst({
          where: { id: userId }
        })
        const userToFollow = await this.prisma.user.findFirst({
          where: { id: userToFollowId },
        })
        const following = user.following
        const followingCheck = following.indexOf(userToFollowId)
        console.log('followingCheck', followingCheck)
        for (let i = 0; i < following.length; i++) {
          if (following[i] == userToFollowId) {
            console.log('User already follows' + userToFollow.firstName + userToFollow.lastName)
            throw new Error(`User already follows ${userToFollow.firstName} ${userToFollow.lastName}`)
          }
        }
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: {
            following: {
              push: userToFollowId
            }
          }
        })
        const updatedUserToFollow = await this.prisma.user.update({
          where: { id: userToFollowId },
          data: {
            followers: {
              push: userId
            }
          }
        })
        if (updatedUser && updatedUserToFollow) {
          console.log('Added follower - updated user: ', updatedUser)
          console.log('Added following - updated user', updatedUserToFollow)
          return { message: `Successfully followed ${userToFollow.firstName} ${userToFollow.lastName}` }
        }
        else {
          console.log("Could not update user or userToFollow.")
          throw new Error("Could not update user or userToFollow.")
        }
      }
      else {
        console.log('Missing userId or userToFollowId')
        throw new Error("Missing userId or userToFollowId")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("Unable to follow this user. Please try again.")
    }
  }

  async removeFollowerFromUser(userId: string, userToUnfollowId: string) {
    try {
      if (userId && userToUnfollowId) {
        const user = await this.prisma.user.findFirst({
          where: { id: userId },
        })
        const userToUnfollow = await this.prisma.user.findFirst({
          where: { id: userToUnfollowId }
        })
        let updateUserFollowingArray: any
        const following = user.following
        const index = following.indexOf(userToUnfollowId)
        if (index != -1) {
          // Remove id from following array and update user following array
          const updatedFollowingArray = following.splice(index, 1)
          updateUserFollowingArray = await this.prisma.user.update({
            where: { id: userId },
            data: {
              following: updatedFollowingArray
            }
          })
          console.log('updated user following array', updateUserFollowingArray)
        }
        else {
          console.log('User does not currently follow' + userToUnfollow.firstName + userToUnfollow.lastName)
          throw new Error(`User does not follow ${userToUnfollow.firstName} ${userToUnfollow.lastName}.`)
        }
        
          // Remove id from followers of user to unfollow and update followers array
          let updatedFollowersArray: any
          const followers = userToUnfollow.followers
          const _index = followers.indexOf(userId)
          if (index != -1) {
            updatedFollowersArray = followers.splice(_index, 1)
            const updateFollowersArray = await this.prisma.user.update({
              where: { id: userToUnfollowId },
              data: {
                followers: updatedFollowersArray
              }
            })
            console.log('updated userToUnfollow followers array', updateFollowersArray)
          }   
          else {
            console.log('User does not currently have' + userToUnfollow.firstName + userToUnfollow.lastName + 'as a follower')
            throw new Error(`User does not have ${userToUnfollow.firstName} ${userToUnfollow.lastName} as a follower.`)
          }
        if (updateUserFollowingArray && updatedFollowersArray) {
          return { message: `Successfully removed follower: ${userToUnfollow.firstName} ${userToUnfollow.lastName}` }  
        }
        else {
          console.log('Could not update user followin array or userToUnfollow followers array')
          throw new Error("Could not update user followin array or userToUnfollow followers array")
        }
      }
      else {
        console.log("Missing userId or userToUnfollowId")
        throw new Error(`Missing userId or userToConnectWithId - userId: ${userId}, userToUnfollowId: ${userToUnfollowId}`)
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Unable to unfollow this user. Please try again.")
    }
  }

  async followerIntersection(user1_Id: string, user2_Id: string) {
    try {
      const user1 = await this.prisma.user.findFirst({
        where: { id: user1_Id }
      })
  
      const user2 = await this.prisma.user.findFirst({
        where: { id: user2_Id }
      })
  
      if (user1 && user2) {
        const followers_user1 = user1.followers
        const followers_user2 = user2.followers
        const followersIntersection = followers_user1.filter(follower => followers_user2.includes(follower))
        if (followersIntersection.length > 0) {
          return followersIntersection
        }
        else {
          console.log(`User: ${user1.firstName} ${user1.lastName} has no common followers with user: ${user2.firstName} ${user2.lastName}`)
          return {message: `User: ${user1.firstName} ${user1.lastName} has no common followers with user: ${user2.firstName} ${user2.lastName}`}
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
          return {message: `User: ${user1.firstName} ${user1.lastName} has no common connections with user: ${user2.firstName} ${user2.lastName}`}
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
        where: { id: userId }
      })
      const userFollowers = user.followers
      const allUsers = await this.getAll()
      if (user && allUsers) {
        const filteredUsers = allUsers.filter(filterUser => !userFollowers.includes(filterUser.id))
        if (filteredUsers) {
          let recommendationsResult = []
          for (let i = 0; i < 3; i++) {
            const randomInt = Math.floor((filteredUsers.length - 1) * Math.random())
            const randomUser = filteredUsers[randomInt]
            if (randomUser) {
              recommendationsResult.push(randomUser)
              filteredUsers.splice(randomInt, 1)
            }
            else {
              console.log("Could not find random user.")
              throw new Error("Could not find random user.")
            }
          }
          return recommendationsResult
        }
        else {
          console.log(`Could not find users that ${user.firstName} ${user.lastName} does not follow.`)
          throw new Error(`Could not find users that ${user.firstName} ${user.lastName} does not follow.`)
        }
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

  async userRecommendations(userId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId }
      })
      const allUsers = await this.getAll()
      if (allUsers.length > 0) {
        let intersectionsCounts = []
        for (let i = 0; i < allUsers.length; i++) {
          const connectionIntersections = allUsers[i].connections.filter((connection: string) => user.connections.includes(connection))
          const followerIntersections = allUsers[i].followers.filter((follower: string) => user.followers.includes(follower))
          const totalIntersections = connectionIntersections.length + followerIntersections.length
          intersectionsCounts.push([allUsers[i].id, totalIntersections])
        }
        // sort array by most follower / connection intersections and return
        const mostMutual = intersectionsCounts
          .sort(([ , a], [ , b]) => b - a)
          .slice(0, 3)
        const recommendations = []
        if (mostMutual) {
          for (let i = 0; i < mostMutual.length; i++) {
            const _user = await this.prisma.user.findFirst({
              where: { id: mostMutual[i][0] }
            })
            const filteredFollowers = _user.followers.filter((follower: string) => !user.followers.includes(follower))
            if (filteredFollowers.length > 0) {
              const getUser = await this.prisma.user.findFirst({
                where: { id: filteredFollowers[0] }
              })
              recommendations.push(getUser)
            }
            else {
              return {
                message: `Could not retrieve recommendations for ${user.firstName} ${user.lastName} to follow.`,
              }
            }
          }
          return {
            message: `Recommendations for ${user.firstName} ${user.lastName} to follow.`,
            recommendations: recommendations
          }
        }
        else {
          console.log("Could not find the most mutual followers / connections")
          throw new Error ("Could not find the most mutual followers / connections")
        }
        return
      }
      else {
        console.log(`Could not find any users.`)
        throw new Error(`Could not find any users.`)
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("Unable to recommend users. Please try again.")
    }
  }
}
