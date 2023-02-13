import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import {BadRequestException, UnauthorizedException} from "@nestjs/common";
import { PasswordsService } from "src/utils/passwords/passwords.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import * as bcrypt from "bcrypt";

const saltOrRounds = 8

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const generateRandomString = (length) => {
  let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const groupId = "63d466d560f07622c546614f"

const createUserDto: CreateUserDto = {
  firstName: "Daena",
  lastName: "McClintock",
  email: generateRandomString(6) + "@gmail.com",
  // email: 'daena.mcclintock@gmail.com',
  password: "ThriveIN1234",
  bio: "Software Engineer at ThriveIN",
  status: "Employed",
  magicAuthentication: false
}

const updateUserDto: UpdateUserDto = {}

describe("UsersController", () => {
  let controller: UsersController;

  const getUserFromEmail = async (email: string) => {
    try {
      const result = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (result) {
        console.log("RESULT", result);
  
        return result;
      } 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  let mockPasswordService = {
    hashPassword: jest.fn().mockImplementation(async (password: string) => {
      return await bcrypt.hash(password, saltOrRounds);
    }),

    comparePassword: jest.fn().mockImplementation(async (password: string, hash: string) => {
      const isMatch = await bcrypt.compare(password, hash);
      return isMatch;
    })
  }

  let mockUsersService = {
    create: jest.fn().mockImplementation(async (data: any, token: string) => {
      try {
        const user = await getUserFromEmail(data.email);
        if (user) {
          throw new BadRequestException("User already Exists");
        } 
        else {
          //hashing new user password
          const pass = await mockPasswordService.hashPassword(data.password);
          //create new user account with hashed password
          //hashed password in pass
          data.password = pass;
          const result = await prisma.user.create({
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
    }),

    getUserFromEmail: jest.fn().mockImplementation(async (email: string) => {
      try {
        const result = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });
        if (result) {
          console.log("RESULT", result);
    
          return result;
        } 
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    verifyUserEmail: jest.fn().mockImplementation(async (email: string) => {
      try {
        const result = await prisma.user.update({
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
    }),

    getUserFromId: jest.fn().mockImplementation(async (_id: string) => {
      try {
        const user = await prisma.user.findFirst({
          where: { id: _id },
          include: { jobProfile: true, location: true },
        });
        return user;
      } catch (error) {
        console.log(`Error Occured, ${error}`);
      }
    }),

    getAll: jest.fn().mockImplementation(async () => {
      try {
        const user = prisma.user.findMany({
            select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            jobProfile: true,
            location: true,
            bio: true,
            profileImage: true,
          },
        });
        return user;
      } catch (error) {
        console.log(`Error Occured, ${error}`);
      }
    }),

    getUserFromConfirmationCode: jest.fn().mockImplementation(async (confirmationCode: string) => {
      try {
        const user = await prisma.user.findFirst({
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
    }),

    updateUserVerification: jest.fn().mockImplementation(async (data: any) => {
      try {
        const user = await prisma.user.findFirst({
          where: { email: data.email },
        });
        if (user) {
          const result = await prisma.user.update({
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

    validateUser: jest.fn().mockImplementation(async (email: string, pass: string) => {
      try {
        const user1 = await prisma.user.findFirst({
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
          const isMatch = await mockPasswordService.comparePassword(
            pass,
            user1.password
          );
          if (!isMatch) {
            throw new UnauthorizedException("Email/password incorrect");
          } else {
            const { password, ...user } = user1;
            console.log("user", user);
  
            return user;
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
          return { message: `Successfully followed ${userToFollow.firstName} ${userToFollow.lastName}` }
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
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        PrismaService
      ],
    })
    .overrideProvider(UsersService)
    .useValue(mockUsersService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should define a function to create a user", () => {
    expect(controller.create).toBeDefined()
  })

  let newUser: any
  let req: any
  it("should create a user", async () => {
    const createdUser = await controller.create(createUserDto, generateRandomString(7))
    newUser = createdUser
    req = {
      user: {
        id: createdUser.id
      }
    }
    expect(createdUser).toEqual({
      bio: expect.any(String),
      confirmationCode: expect.any(String),
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
      password: expect.any(String),
      profileImage: null,
      status: expect.any(String)
    })
  })

  it("should define a function to get a user from the email", () => {
    expect(controller.getUserFromEmail).toBeDefined()
  })

  it("should get a user from the email", async () => {
    const userFromEmail = await controller.getUserFromEmail(newUser.email)
    expect(userFromEmail).toEqual({
      bio: expect.any(String),
      confirmationCode: expect.any(String),
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
      password: expect.any(String),
      profileImage: null,
      status: expect.any(String)
    })
  })

  it("should define a function to get a user by the id", () => {
    expect(controller.getUserFromId).toBeDefined()
  })

  it("should get a user by id", async () => {
    const userById = await controller.getUserFromId(req)
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
      lastName: expect.any(String),
      followers: expect.any(Array),
      following: expect.any(Array),
      location: expect.any(Array),
      password: expect.any(String),
      profileImage: null,
      status: expect.any(String)
    })
  })

  it("should define a function to get all the users", () => {
    expect(controller.getAll).toBeDefined()
  })

  it("should get all the users", async () => {
    const allUsers = await controller.getAll()
    expect(allUsers).toEqual(
      expect.any(Array)
    )
  })

  it("should define a function to add a user to a group", () => {
    expect(controller.addUserToGroup).toBeDefined()
  })

  it("should add a user to a group", async () => {
    const userAddedToGroup = await controller.addUserToGroup(req, groupId)
    expect(userAddedToGroup).toEqual(
      { message: "Successfully Added to Group!" }
    )
    const userById = await controller.getUserFromId(req)
    console.log('user with group', userById)
  })

  it("should define a function to remove a user from a group", () => {
    expect(controller.addUserToGroup).toBeDefined()
  })

  it("should remove a user from a group", async () => {
    const group = await prisma.group.findFirst({
      where: { id: groupId }
    })
    const userRemovedFromGroup = await controller.removeUserFromGroup(req, groupId)
    expect(userRemovedFromGroup).toEqual(expect.any(Object))
    expect(userRemovedFromGroup).toEqual(
      { message: `Successfully removed user: ${newUser.firstName} ${newUser.lastName} from group ${group.name}` }
    )
  })

  it("should define a function to delete a user profile by id", () => {
    expect(controller.deleteUser).toBeDefined()
  })

  it("should delete a user profile by id", async () => {
    // const deletedUserProfile = await service.deleteUser(req)
    // expect(deletedUserProfile).toEqual(
    //   { message: "deleted Successfully" }
    // )
  })

  it("should define a function to request a connection to a user", () => {
    expect(controller.addConnectionRequestToUser).toBeDefined()
  })

  let userToConnectWith: any
  it("should request a connection to a user", async () => {
    userToConnectWith = await prisma.user.findFirst({})
    console.log('userToConnectWith', userToConnectWith)
    const requestedConnection = await controller.addConnectionRequestToUser(req, userToConnectWith.id)
    expect(requestedConnection).toEqual(
      expect.any(Object)
    )
    // expect(requestedConnection).toEqual(
    //   { message:  `Successfully sent connection request to ${userToConnectWith.firstName} ${userToConnectWith.lastName}`}
    // )
  })

  it("should define a function to approve the connection request", () => {
    expect(controller.approveConnectionRequest).toBeDefined()
  })

  it("should approve a connection request", async () => {
    const approvedConnection = await controller.approveConnectionRequest(req, userToConnectWith.id)
    console.log('approvedConnection', approvedConnection)
    // expect(approvedConnection).toEqual({

    // })
  })

  it("should define a function to remove a connection", () => {
    expect(controller.approveConnectionRequest).toBeDefined()
  })

  it("should remove a connection from both user arrays", async () => {
    const userConnectedWith = await prisma.user.findFirst({})
    const removedConnection = await controller.removeConnection(req, userConnectedWith.id)
    console.log('removedConnection', removedConnection)
    expect(removedConnection).toEqual(
      expect.any(Object)
    )
    expect(removedConnection).toEqual({
      message: expect.any(String)
    })
  })

  it("should define a function to add a follower to a user", () => {
    expect(controller.addFollowerToUser).toBeDefined()
  })

  let userToFollow: any
  it("should add a follower to the user", async () => {
    userToFollow = await prisma.user.findFirst({})
    const addedFollower = await controller.addFollowerToUser(req, userToFollow.id)
    console.log('addedFollower', addedFollower)
    expect(addedFollower).toEqual(
      expect.any(Object)
    )
    expect(addedFollower).toEqual({
      message: expect.any(String)
    })
  })

  it("should define a function to remove a follower", () => {
    expect(controller.addFollowerToUser).toBeDefined()
  })

  it("should remove a follower from user", async () => {
    const userToRemoveFollowFrom = userToFollow
    const removedFollower = await controller.removeFollowerFromUser(req, userToRemoveFollowFrom.id)
    console.log('removedFollower', removedFollower)
    expect(removedFollower).toEqual(
      expect.any(Object)
    )
    expect(removedFollower).toEqual({
      message: expect.any(String)
    })
  })
})
