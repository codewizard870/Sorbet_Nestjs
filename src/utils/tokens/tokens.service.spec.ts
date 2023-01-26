import { Test, TestingModule } from "@nestjs/testing";
import { TokensService } from "./tokens.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

let mockUser = {
  id: '63cf4ccadfc19cc0f1e335f4'
}

let mockTokenService = {
  getTokenByUserId: jest.fn().mockImplementation(async (userId: string) => {
    try {
      const token = await prisma.token.findFirst({
        where: {
          userId: userId,
        },
      });

      return token;
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }),

  createTokenByUserId: jest.fn().mockImplementation(async (_id: string, hash: string) => {
    try {
      const token = await prisma.token.create({
        data: {
          token: hash,
          userId: _id,
        },
      });

      return token;
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }),

  deleteToken: jest.fn().mockImplementation(async (id: string) => {
    try {
      return await prisma.token.delete({
        where: {
          userId: id,
        },
      });
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }),
}

describe("TokensService", () => {
  let service: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokensService, PrismaService],
    })
    .overrideProvider(TokensService)
    .useValue(mockTokenService)
    .compile();

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<TokensService>(TokensService)
  });

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should define a function to create a token by the userId", () => {
    expect(service.createTokenByUserId).toBeDefined()
  })

  it("should create a token", async () => {
    const token = await mockTokenService.getTokenByUserId(mockUser.id);
    console.log('token', token)
    if (token) {
      await mockTokenService.deleteToken(mockUser.id)
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hashSync(resetToken, 8);
    const createdToken = await service.createTokenByUserId(mockUser.id, hash);
    expect(createdToken).toEqual({
      id: expect.any(String),
      token: expect.any(String),
      createdAt: expect.any(Date),
      userId: expect.any(String)
    })
  })

  it("should define a function to get a token by userId", () => {
    expect(service.getTokenByUserId).toBeDefined()
  })

  it("should get a token by user id", async () => {
    const token = await service.getTokenByUserId(mockUser.id)
    expect(token).toEqual({
      id: expect.any(String),
      token: expect.any(String),
      createdAt: expect.any(Date),
      userId: expect.any(String)
    })
  })

  it("should define a function to delete a token by the id", () => {
    expect(service.deleteToken).toBeDefined()
  })

  it("should delete a token by id", async () => {
    const deletedToken = await service.deleteToken(mockUser.id)
    console.log('deletedToken', deletedToken)
    expect(deletedToken).toEqual({
      id: expect.any(String),
      token: expect.any(String),
      createdAt: expect.any(Date),
      userId: expect.any(String)
    })
  })
})
