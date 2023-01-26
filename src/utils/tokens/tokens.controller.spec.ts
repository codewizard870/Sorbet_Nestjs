import { Test, TestingModule } from "@nestjs/testing";
import { TokensController } from "./tokens.controller";
import { TokensService } from "./tokens.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

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
      const token: any = await prisma.token.findFirst({
        where: {
          id: id,
        },
      });
      // return await prisma.token.delete({
      //   where: {
      //     id: id,
      //   },
      // });
      if (token) {
        return await prisma.token.delete(token)
      }
      else {
        return {
          createdAt: expect.any(Date),
          id: expect.any(String),
          token: expect.any(String),
          userId: expect.any(String)
        }
        // throw new Error("Token was not found or has already been deleted.")
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }),
}

describe("TokensController", () => {
  let controller: TokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokensController],
      providers: [TokensService, PrismaService],
    })
    .overrideProvider(TokensService)
    .useValue(mockTokenService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<TokensController>(TokensController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})
