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

const createUserDto: CreateUserDto = {
  firstName: "Daena",
  lastName: "McClintock",
  // email: generateRandomString(6) + "@gmail.com",
  email: 'daena.mcclintock@gmail.com',
  password: "ThriveIN1234",
  bio: "Software Engineer at ThriveIN",
  status: "Employed",
  magicAuthentication: false
}

const updateUserDto: UpdateUserDto = {}

const req = {
  user: {
    id: '63942effdce005928e2d3ae1'
  }
}

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

  let mockUsersService ={
    create: jest.fn().mockImplementation(async (data: any, token: string) => {
      try {
        const user = await getUserFromEmail(data.email);
        if (user) {
          throw new BadRequestException("User already Exists");
        } 
        else {
          const pass = await mockPasswordService.hashPassword(data.password);
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
    })
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
    expect(controller).toBeDefined()
  })

  it("should define a function to create a user", () => {
    expect(controller.create).toBeDefined()
  })

  let newUser: any
  let req: any
  it("should create a user", async () => {
    const createdUser = await controller.create(createUserDto, generateRandomString(7))
    newUser = createdUser
    req = { user: { id: createdUser.id } }
    expect(createdUser).toEqual({
      bio: expect.any(String),
      confirmationCode: expect.any(String),
      createdAt: expect.any(Date),
      email: expect.any(String),
      firstName: expect.any(String),
      id: expect.any(String),
      lastName: expect.any(String),
      password: expect.any(String),
      profileImage: null,
      status: expect.any(String)
    })
  })

  it("should define a function to create a user", () => {
    expect(controller.getAll).toBeDefined()
  })

  let usersArr: any
  it("should get all of the users", async () => {
    const allUsers = await controller.getAll()
    usersArr = allUsers
    expect(allUsers).toEqual(expect.any(Array))
  })

  it("should define a function to update a user profile", () => {
    expect(controller.update).toBeDefined()
  })

  it("should update a user", async () => {
    const updatedUser = await controller.update(req, updateUserDto)
    expect(updatedUser).toEqual(
      { message: 'Update Successfully' }
    )
  })

  it("should define a function to delete a user profile", () => {
    expect(controller.deleteUser).toBeDefined()
  })

  it("should delete a user", async () => {
    const deletedUser = await controller.deleteUser(req)
    expect(deletedUser).toEqual(
      { message: 'deleted Successfully' }
    )
  })
})
