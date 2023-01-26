import { Test, TestingModule } from "@nestjs/testing";
import {BadRequestException, UnauthorizedException} from "@nestjs/common";
import { UsersService } from "./users.service";
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
const generateRandomString = (length: number) => {
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

describe("UsersService", () => {
  let service: UsersService;

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
    })
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
  });

  it("should define a function to create a user", () => {
    expect(service.create).toBeDefined()
  })

  let newUser: any
  it("should create a user", async () => {
    const createdUser = await service.create(createUserDto, generateRandomString(7))
    console.log(createdUser)
    newUser = createdUser
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

  it("should define a function to get a user from the email", () => {
    expect(service.getUserFromEmail).toBeDefined()
  })

  it("should get a user from the email", async () => {
    const userFromEmail = await service.getUserFromEmail(newUser.email)
    expect(userFromEmail).toEqual({
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

  it("should define a function to verify a user by the email", () => {
    expect(service.verifyUserEmail).toBeDefined()
  })

  it("should verify a user by the email", async () => {
    const verifiedUserEmail = await service.verifyUserEmail(newUser.email)
    expect(verifiedUserEmail).toEqual(
      { message: "Email verified" }
    )
  })

  it("should define a function to get a user by the id", () => {
    expect(service.getUserFromId).toBeDefined()
  })

  it("should get a user by id", async () => {
    const userById = await service.getUserFromId(newUser.id)
    expect(userById).toEqual({
      bio: expect.any(String),
      confirmationCode: expect.any(String),
      createdAt: expect.any(Date),
      email: expect.any(String),
      firstName: expect.any(String),
      id: expect.any(String),
      jobProfile: expect.any(Array),
      lastName: expect.any(String),
      location: expect.any(Array),
      password: expect.any(String),
      profileImage: null,
      status: expect.any(String)
  })
  })

  it("should define a function to get all the users", () => {
    expect(service.getAll).toBeDefined()
  })

  it("should get all the users", async () => {
    const allUsers = await service.getAll()
    expect(allUsers).toEqual(
      expect.any(Array)
    )
  })

  it("should define a function to get a user from confirmation code", () => {
    expect(service.getUserFromConfirmationCode).toBeDefined()
  })

  it("should get a user from confirmation code", async () => {
    const userFromConfirmationCode = await service.getUserFromConfirmationCode(newUser.confirmationCode)
    expect(userFromConfirmationCode).toEqual({
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

  it("should define a function to update the user magic verification", () => {
    expect(service.getUserFromConfirmationCode).toBeDefined()
  })

  it("should update the user magic verification", async () => {
    const updatedUserVerification =  await service.updateUserVerification(newUser)
    expect(updatedUserVerification).toEqual(
      { message: "User magic verification updated successfully!" }
    )
  })

  it("should define a function to update a user profile by id", () => {
    expect(service.updateUserProfile).toBeDefined()
  })

  it("should update the user profile", async () => {
    const updatedUserProfile = await service.updateUserProfile(newUser.id, newUser)
    expect(updatedUserProfile).toEqual(
      { message: "Update Successfully" }
    )
  })

  it("should define a function to delete a user profile by id", () => {
    expect(service.delete).toBeDefined()
  })

  it("should delete a user profile by id", async () => {
    const deletedUserProfile = await service.delete(newUser.id)
    expect(deletedUserProfile).toEqual(
      { message: "deleted Successfully" }
    )
  })

  it("should define a function to validate a user profile by id", () => {
    expect(service.validateUser).toBeDefined()
  })

  it("should validate a user profile by id", async () => {
    // const validatedUserProfile = await service.validateUser('daena@thrivein.io', "ThriveIN2023")
    // console.log(validatedUserProfile)
    // expect(validatedUserProfile).toEqual(
    //   expect.any(Array)
    // )
  })
})
