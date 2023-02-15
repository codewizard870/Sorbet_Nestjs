import { Test, TestingModule } from "@nestjs/testing";
import {BadRequestException, ConsoleLogger, UnauthorizedException} from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const generateRandomString = (length: number) => {
  let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result
}

const createUserDto: CreateUserDto = {
  nearWallet: generateRandomString(64),
  firstName: "Daena",
  lastName: "McClintock",
  email: generateRandomString(6) + "@gmail.com",
  // email: 'daena.mcclintock@gmail.com',
  bio: "Software Engineer at ThriveIN",
  profileImage: 'null',
}

const updateUserDto: UpdateUserDto = {
  bio: "Software Developer at ThriveIN"
}

const groupId = "63d466d560f07622c546614f"

describe("UsersService", () => {
  let service: UsersService;

  let mockGroupsService = {
    create: jest.fn().mockImplementation(async (data: any, userId: string) => {
      try {
        const result = await prisma.group.create({
          data: {
            name: data.name,
            description: data.description,
            image: data.image,
            group_owner: userId,
            userIDs: data.userIDs,
            // members: data.members,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          }
        })
        if (result) {
          return result
        } 
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findAll: jest.fn().mockImplementation(async () => {
      try {
        return await prisma.group.findMany({
          include: { members: true },
        })
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findOne: jest.fn().mockImplementation(async (_id: string) => {
      try {
        const group = await prisma.group.findFirst({
          where: { id: _id },
          include: { members: true },
        });
        return group
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    update: jest.fn().mockImplementation(async (id: string, data: any) => {
      const result = await prisma.group.update({
        where: { id: id },
        data: data,
      })
      if (result) {
        return { message: "Updated Successfully" }
      }
      else {
        return { message: "Something went wrong" }
      }
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
      const result = await prisma.group.delete({
        where: { id: id },
      })
      if (result) {
        return { message: "Deleted Successfully" };
      } 
      else {
        return { message: "Something went wrong" };
      }
    }),
  }

  let mockUsersService = {
    create: jest.fn().mockImplementation(async (data: any, token: string) => {
      try {
        const userFromEmail = await mockUsersService.getUserFromEmail(data.email)
        const UserFromNearWallet = await mockUsersService.getUserFromNearWallet(data.nearWallet)
        if (userFromEmail || UserFromNearWallet) {
          throw new BadRequestException("User already Exists")
        }
        else {
          const result = await prisma.user.create({
            data: {
              nearWallet: data.nearWallet,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              jobProfile: data.jobProfile,
              location: data.location,
              bio: data.bio,
              profileImage: null,
              confirmationCode: token,
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
    }),

    getUserFromEmail: jest.fn().mockImplementation(async (email: string) => {
      try {
        const result = await prisma.user.findFirst({
          where: {email: email},
          include: { jobProfile: true, location: true, post: true, groups: true },
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
    }),

    getUserFromNearWallet: jest.fn().mockImplementation(async (nearWallet: string) => {
      try {
        const result = await prisma.user.findFirst({
          where: {nearWallet: nearWallet},
          include: { jobProfile: true, location: true, post: true, groups: true },
        })
        if (result) {  
          return result
        }
        else {
          console.log("Could not find user by near wallet address")
          return
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    getUserFromId: jest.fn().mockImplementation(async (_id: string) => {
      try {
        const user = await prisma.user.findFirst({
          where: { id: _id },
          include: { jobProfile: true, location: true, post: true, groups: true },
        });
        return user;
      } catch (error) {
        console.log(`Error Occured, ${error}`);
      }
    }),

    getAll: jest.fn().mockImplementation(async () => {
      try {
        const allUsers = await prisma.user.findMany({
          include: { jobProfile: true, location: true, post: true, groups: true }
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
    }),

    updateUserProfile: jest.fn().mockImplementation(async (_id: string, data: any) => {
      try {
        const user = await prisma.user.findFirst({
          where: { id: _id },
        })
        if (user) {
          const result = await prisma.user.update({
            where: { id: _id },
            data: {
              nearWallet: data.nearWallet,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              jobProfile: data.jobProfile,
              location: data.location,
              bio: data.bio,
              profileImage: data.profileImage,
            },
          });
          console.log(result)
          if (result) {
            return { message: "Update Successfully" };
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
    }),

    delete: jest.fn().mockImplementation(async (_id: string) => {
      try {
        const user = await prisma.user.findFirst({
          where: { id: _id },
        })
        if (user) {
          const result = await prisma.user.delete({
            where: { id: _id },
          });
          if (result) {
            return { message: "deleted Successfully" };
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
    }),

    addUserToGroup: jest.fn().mockImplementation(async (userId: string, groupId: string) => {
      try {
        const user = await prisma.user.findFirst({
          where: { id: userId },
          include: { groups: true }
        })
        const group = await prisma.group.findFirst({
          where: { id: groupId },
          include: { members: true }
        })
        if(user && group) {
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
              groupIDs: {
                push: group.id
              }
            }
          })
          const updatedGroup = await prisma.group.update({
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
    }),

    removeUserFromGroup: jest.fn().mockImplementation(async (userId: string, groupId: string) => {
      try {
        const user = await prisma.user.findFirst({
          where: { id: userId },
          include: { groups: true }
        })
        const group = await prisma.group.findFirst({
          where: { id: groupId },
          include: { members: true }
        })
        if (user && group) {
          // remove groupId from user groupIDs array
          const groups = user.groupIDs
          const index = groups.indexOf(groupId)
          const updatedGroupsArray = groups.splice(index, 1)
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
              groupIDs: updatedGroupsArray
            }
          })
          // remove userId from group userIDs array
          const users = group.userIDs
          const _index = users.indexOf(userId)
          const updatedUsersArray = users.splice(_index, 1)
          const updatedGroup = await prisma.group.update({
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
    }),

    addConnectionRequestToUser: jest.fn().mockImplementation(async (userId: string, userToConnectWithId: string) => {
      try {
        if (userId && userToConnectWithId) {
          const userToConnectWith = await prisma.user.findFirst({
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
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
              connection_requests: {
                push: userToConnectWithId
              }
            }
          })
          console.log('Added connection - updated user: ', updatedUser)
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
    }),

    approveConnectionRequest: jest.fn().mockImplementation(async (userId: string, userToConnectWithId: string) => {
      try {
        if (userId && userToConnectWithId) {
          const user = await prisma.user.findFirst({
            where: { id: userId }
          })
          const userToConnectWith = await prisma.user.findFirst({
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
              const updatedUserConnectionRequestsArray = await prisma.user.update({
                where: {id: userId },
                data: {
                  connection_requests: updatedConnectionRequestsArray
                }
              })
              console.log('updatedUserConnectionRequestsArray', updatedUserConnectionRequestsArray)
              const updatedUserConnectionsArray = await prisma.user.update({
                where: { id: userId },
                data: {
                  connections: {
                    push: userToConnectWithId
                  }
                }
              })
              console.log('updatedUserConnectionsArray', updatedUserConnectionsArray)
              const updatedUserToConnectWithConnectionsArray = await prisma.user.update({
                where: { id: userToConnectWithId },
                data: {
                  connections: {
                    push: userId
                  }
                }
              })
              console.log('updatedUserToConnectWithConnectionsArray', updatedUserToConnectWithConnectionsArray)
              if (updatedUserConnectionRequestsArray && updatedUserConnectionsArray && updatedUserToConnectWithConnectionsArray) {
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
    }),

    removeConnection: jest.fn().mockImplementation(async (userId: string, userToUnconnectWithId: string) => {
      try {
        if (userId && userToUnconnectWithId) {
          const user = await prisma.user.findFirst({
            where: { id: userId }
          })
          const userToUnconnectWith = await prisma.user.findFirst({
            where: { id: userToUnconnectWithId }
          })
          if (user && userToUnconnectWith) {
            const connectionsArray = user.connections
            const index = connectionsArray.indexOf(userToUnconnectWithId)
            const updatedConnectionsArray = connectionsArray.splice(index, 1)
            const removedConnection = await prisma.user.update({
              where: { id: userId },
              data: {
                connections: updatedConnectionsArray
              }
            })
            const connectionsArray2 = userToUnconnectWith.connections
            const index2 = connectionsArray2.indexOf(userId)
            const updatedConnectionsArray2 = connectionsArray2.splice(index2, 1)
            const removedConnection2 = await prisma.user.update({
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
    }),

    addFollowerToUser: jest.fn().mockImplementation(async (userId: string, userToFollowId: string) => {
      try {
        if (userId && userToFollowId) {
          const user = await prisma.user.findFirst({
            where: { id: userId }
          })
          const userToFollow = await prisma.user.findFirst({
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
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
              following: {
                push: userToFollowId
              }
            }
          })
          const updatedUserToFollow = await prisma.user.update({
            where: { id: userToFollowId },
            data: {
              followers: {
                push: userId
              }
            }
          })
          console.log('Added follower - updated user: ', updatedUser)
          console.log('Added following - updated user', updatedUserToFollow)
          if (updatedUser && updatedUserToFollow) {
            return { message: `${user.firstName} ${user.lastName} successfully followed ${userToFollow.firstName} ${userToFollow.lastName}` }
          }
          else {
            console.log("Failed to update user or userToFollow")
            throw new Error("Failed to update user or userToFollow")
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
    }),

    removeFollowerFromUser: jest.fn().mockImplementation(async (userId: string, userToUnfollowId: string) => {
      try {
        if (userId && userToUnfollowId) {
          const user = await prisma.user.findFirst({
            where: { id: userId },
          })
          const userToUnfollow = await prisma.user.findFirst({
            where: { id: userToUnfollowId }
          })
          let updateUserFollowingArray: any
          const following = user.following
          const index = following.indexOf(userToUnfollowId)
          if (index != -1) {
            // Remove id from following array and update user following array
            const updatedFollowingArray = following.splice(index, 1)
            updateUserFollowingArray = await prisma.user.update({
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
              const updateFollowersArray = await prisma.user.update({
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
    }),

    followerIntersection: jest.fn().mockImplementation(async (user1_Id: string, user2_Id: string) => {
      try {
        const user1 = await prisma.user.findFirst({
          where: { id: user1_Id }
        })
    
        const user2 = await prisma.user.findFirst({
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
            return {message: `User: ${user1.firstName} ${user1.lastName} has no common followers with user: ${user2.firstName} ${user2.lastName}`}
          }
        }
        else {
          console.log("Could not find user1 or user2.")
          throw new Error("Could not find user1 or user2.")
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("Unable to check for mutual followers. Please try again.")
      }
    }),

    connectionIntersection: jest.fn().mockImplementation(async (user1_Id: string, user2_Id: string) => {
      try {
        const user1 = await prisma.user.findFirst({
          where: { id: user1_Id }
        })
    
        const user2 = await prisma.user.findFirst({
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
    }),

    userRandomRecommendations: jest.fn().mockImplementation(async (userId: string) => {
      try {
        const user = await prisma.user.findFirst({
          where: { id: userId }
        })
        const userFollowers = user.followers
        const allUsers = await mockUsersService.getAll()
        if (user && allUsers) {
          const filteredUsers = allUsers.filter((filterUser: any) => !userFollowers.includes(filterUser.id))
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
    }),

    userRecommendations: jest.fn().mockImplementation(async (userId: string) => {
      try {
        const user = await prisma.user.findFirst({
          where: { id: userId }
        })
        const allUsers = await mockUsersService.getAll()
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
              const _user = await prisma.user.findFirst({
                where: { id: mostMutual[i][0] }
              })
              const filteredFollowers = _user.followers.filter((follower: string) => !user.followers.includes(follower))
              if (filteredFollowers.length > 0) {
                const getUser = await prisma.user.findFirst({
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
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    })
    .overrideProvider(UsersService)
    .useValue(mockUsersService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  })

  it("should define a function to create a user", () => {
    expect(service.create).toBeDefined()
  })

  let newUser: any
  it("should create a user", async () => {
    const createdUser = await service.create(createUserDto, generateRandomString(24))
    newUser = createdUser
    expect(createdUser).toEqual({
      nearWallet: expect.any(String),
      confirmationCode: expect.any(String),
      bio: expect.any(String),
      connection_requests: expect.any(Array),
      connections: expect.any(Array),
      createdAt: expect.any(Date),
      email: expect.any(String),
      firstName: expect.any(String),
      followers: expect.any(Array),
      following: expect.any(Array),
      groupIDs: expect.any(Array),
      id: expect.any(String),
      lastName: expect.any(String),
      profileImage: null,
    })
  })

  it("should define a function to get a user from the email", () => {
    expect(service.getUserFromEmail).toBeDefined()
  })

  it("should get a user from the email", async () => {
    const userFromEmail = await service.getUserFromEmail(newUser.email)
    expect(service.getUserFromEmail).toBeCalled()
    expect(userFromEmail).toEqual({
      bio: expect.any(String),
      confirmationCode: expect.any(String),
      connection_requests: expect.any(Array),
      connections: expect.any(Array),
      createdAt: expect.any(Date),
      email: expect.any(String),
      firstName: expect.any(String),
      groupIDs: expect.any(Array),
      id: expect.any(String),
      jobProfile: expect.any(Array),
      groups: expect.any(Array),
      post: expect.any(Array),
      lastName: expect.any(String),
      followers: expect.any(Array),
      following: expect.any(Array),
      location: expect.any(Array),
      profileImage: null,
      nearWallet: expect.any(String)
    })
  })

  it("should define a function to get a user from the near wallet address", () => {
    expect(service.getUserFromNearWallet).toBeDefined()
  })

  it("should get a user from the near wallet address", async () => {
    const userFromNearWallet = await service.getUserFromNearWallet(newUser.nearWallet)
    expect(service.getUserFromNearWallet).toBeCalled()
    expect(userFromNearWallet).toEqual(expect.any(Object))
    expect(userFromNearWallet).toEqual({
      bio: expect.any(String),
      confirmationCode: expect.any(String),
      connection_requests: expect.any(Array),
      connections: expect.any(Array),
      createdAt: expect.any(Date),
      email: expect.any(String),
      firstName: expect.any(String),
      groupIDs: expect.any(Array),
      id: expect.any(String),
      jobProfile: expect.any(Array),
      groups: expect.any(Array),
      post: expect.any(Array),
      lastName: expect.any(String),
      followers: expect.any(Array),
      following: expect.any(Array),
      location: expect.any(Array),
      profileImage: null,
      nearWallet: expect.any(String)
    })
  })

  it("should define a function to get a user by the id", () => {
    expect(service.getUserFromId).toBeDefined()
  })

  it("should get a user by id", async () => {
    const userById = await service.getUserFromId(newUser.id)
    expect(service.getUserFromId).toBeCalled()
    expect(userById).toEqual({
      bio: expect.any(String),
      confirmationCode: expect.any(String),
      connection_requests: expect.any(Array),
      connections: expect.any(Array),
      createdAt: expect.any(Date),
      email: expect.any(String),
      firstName: expect.any(String),
      groupIDs: expect.any(Array),
      id: expect.any(String),
      jobProfile: expect.any(Array),
      groups: expect.any(Array),
      post: expect.any(Array),
      lastName: expect.any(String),
      followers: expect.any(Array),
      following: expect.any(Array),
      location: expect.any(Array),
      profileImage: null,
      nearWallet: expect.any(String)
    })
  })

  it("should define a function to get all the users", () => {
    expect(service.getAll).toBeDefined()
  })

  it("should get all the users", async () => {
    const allUsers = await service.getAll()
    expect(service.getAll).toBeCalled()
    expect(allUsers).toEqual(
      expect.any(Array)
    )
  })

  it("should define a function to add a user to a group", () => {
    expect(service.addUserToGroup).toBeDefined()
  })

  it("should add a user to a group", async () => {
    const userAddedToGroup = await service.addUserToGroup(newUser.id, groupId)
    expect (service.addUserToGroup).toBeCalled()
    expect(userAddedToGroup).toEqual(
      { message: "Successfully Added to Group!" }
    )
    const userById = await service.getUserFromId(newUser.id)
    console.log('user with group', userById)
  })

  it("should define a function to a group", () => {
    expect(service.addUserToGroup).toBeDefined()
  })

  it("should remove a user from a group", async () => {
    const group = await prisma.group.findFirst({
      where: { id: groupId }
    })
    const userRemovedFromGroup = await service.removeUserFromGroup(newUser.id, groupId)
    expect(service.removeUserFromGroup).toBeCalled()
    expect(userRemovedFromGroup).toEqual(expect.any(Object))
    expect(userRemovedFromGroup).toEqual(
      { message: `Successfully removed user: ${newUser.firstName} ${newUser.lastName} from group ${group.name}` }
    )
  })

  it("should define a function to update a user profile by id", () => {
    expect(service.updateUserProfile).toBeDefined()
  })

  it("should update the user profile", async () => {
    const updatedUserProfile = await service.updateUserProfile(newUser.id, updateUserDto)
    expect(service.updateUserProfile).toBeCalled()
    expect(updatedUserProfile).toEqual(
      { message: "Update Successfully" }
    )
  })

  it("should define a function to request a connection to a user", () => {
    expect(service.addConnectionRequestToUser).toBeDefined()
  })

  let userToConnectWith: any
  it("should request a connection to a user", async () => {
    const allUsers = await service.getAll()
    const randomIndex = Math.floor(allUsers.length * Math.random())
    userToConnectWith = allUsers[randomIndex]
    const requestedConnection = await service.addConnectionRequestToUser(newUser.id, userToConnectWith.id)
    expect(service.addConnectionRequestToUser).toBeCalled()
    expect(requestedConnection).toEqual(
      expect.any(Object)
    )
    expect(requestedConnection).toEqual(
      { message:  `Successfully sent connection request to ${userToConnectWith.firstName} ${userToConnectWith.lastName}`}
    )
  })

  it("should define a function to approve the connection request", () => {
    expect(service.approveConnectionRequest).toBeDefined()
  })

  it("should approve a connection request", async () => {
    const approvedConnection = await service.approveConnectionRequest(newUser.id, userToConnectWith.id)
    console.log('approvedConnection', approvedConnection)
    expect(service.approveConnectionRequest).toBeCalled()
    expect(approvedConnection).toEqual(expect.any(Object))
    expect(approvedConnection).toEqual(
      { message:  `Successfully connected with ${userToConnectWith.firstName} ${userToConnectWith.lastName}`}
    )
  })

  it("should define a function to remove a connection", () => {
    expect(service.approveConnectionRequest).toBeDefined()
  })

  it("should remove a connection from both user arrays", async () => {
    const userConnectedWith = await prisma.user.findFirst({})
    const removedConnection = await service.removeConnection(newUser.id, userConnectedWith.id)
    console.log('removedConnection', removedConnection)
    expect(service.removeConnection).toBeCalled()
    expect(removedConnection).toEqual(
      expect.any(Object)
    )
    expect(removedConnection).toEqual(
      { message: `Successfully removed connection between ${newUser.firstName} ${newUser.lastName} and ${userConnectedWith.firstName} ${userConnectedWith.lastName}` }
    )
  })

  it("should define a function to add a follower to a user", () => {
    expect(service.addFollowerToUser).toBeDefined()
  })

  let userToFollow: any
  it("should add a follower to the user", async () => {
    userToFollow = await prisma.user.findFirst({})
    const addedFollower = await service.addFollowerToUser(newUser.id, userToFollow.id)
    console.log('addedFollower', addedFollower)
    expect(service.addFollowerToUser).toBeCalled()
    expect(addedFollower).toEqual(expect.any(Object))
    expect(addedFollower).toEqual(
      { message: `${newUser.firstName} ${newUser.lastName} successfully followed ${userToFollow.firstName} ${userToFollow.lastName}` }
    )
  })

  it("should define a function to remove a follower", () => {
    expect(service.addFollowerToUser).toBeDefined()
  })

  it("should remove a follower from user", async () => {
    const userToRemoveFollowFrom = userToFollow
    const removedFollower = await service.removeFollowerFromUser(newUser.id, userToRemoveFollowFrom.id)
    expect(service.removeFollowerFromUser).toBeCalled()
    expect(removedFollower).toEqual(
      expect.any(Object)
    )
    expect(removedFollower).toEqual({
      message: expect.any(String)
    })
  })

  it("should define a function to check for follower intersection between two users", () => {
    expect(service.followerIntersection).toBeDefined()
  })

  it("should check for follower intersection between two users", async () => {
    const allUsers = await service.getAll()
    const user1 = allUsers[0]
    const user2 = allUsers[1]
    const followerIntersection = await service.followerIntersection(user1.id , user2.id)
    console.log('followerIntersection', followerIntersection)
    expect(service.followerIntersection).toBeCalled()
    expect(followerIntersection).toEqual(expect.any(Object))
  })

  it("should define a function to check for connection intersection between two users", () => {
    expect(service.followerIntersection).toBeDefined()
  })

  it("should check for connection intersection between two users", async () => {
    const allUsers = await service.getAll()
    const user1 = allUsers[0]
    const user2 = allUsers[1]
    const connectionIntersection = await service.connectionIntersection(user1.id , user2.id)
    console.log('connectionIntersection', connectionIntersection)
    expect(service.connectionIntersection).toBeCalled()
    expect(connectionIntersection).toEqual(expect.any(Object))
  })

  it("should define a function to recommend random users to follow / connect with", () => {
    expect(service.userRandomRecommendations).toBeDefined()
  })

  it("should recommend users to follow / connect with", async () => {
    const getRandomUserRecommendations = await service.userRandomRecommendations('63954916dce005928e2d3ae2')
    expect(service.userRandomRecommendations).toBeCalled()
    expect(getRandomUserRecommendations).toHaveLength(3)
    expect(getRandomUserRecommendations[0]).toEqual(expect.any(Object))
  })

  it("should define a function to recommend users to follow / connect with", () => {
    expect(service.userRecommendations).toBeDefined()
  })

  it("should recommend users to follow / connect with", async () => {
    const getUserRecommendations = await service.userRecommendations('63954916dce005928e2d3ae2')
    expect(service.userRecommendations).toBeCalled()
    expect(getUserRecommendations).toEqual(expect.any(Object))
  })

  it("should define a function to delete a user profile by id", () => {
    expect(service.delete).toBeDefined()
  })

  it("should delete a user profile by id", async () => {
    const deletedUserProfile = await service.delete(newUser.id)
    expect(service.delete).toBeCalled()
    expect(deletedUserProfile).toEqual(
      { message: "deleted Successfully" }
    )
  })
})
