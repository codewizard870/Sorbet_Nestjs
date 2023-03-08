import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { PasswordsController } from "./passwords.controller";
import { PasswordsService } from "./passwords.service";
import { TokensService } from "../tokens/tokens.service";
import { PrismaService } from "../prisma/prisma.service";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import { sendEmail } from "src/utils/auth/constants";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

const saltOrRounds = 8
const BaseUrl = process.env.BASEURL;

const prisma = new PrismaClient()
let mockCtx: MockContext
let ctx: Context

let mockTokensService = {
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
          id: id,
        },
      });
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }),
}

let mockPasswordsService = {
  hashPassword: jest.fn().mockImplementation(async (password: string) => {
    return await bcrypt.hash(password, saltOrRounds);
  }),

  comparePassword: jest.fn().mockImplementation(async (password: string, hash: string) => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }),

  requestPasswordReset: jest.fn().mockImplementation(async (user: any) => {
    const token = await mockTokensService.getTokenByUserId(user._id);
    if (token) {
      await mockTokensService.deleteToken(token.id);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = bcrypt.hashSync(resetToken, 8);
    const result = await mockTokensService.createTokenByUserId(user.id, hash);
    if (result) {
      const content = {
        subject: "Please confirm your account",
        html: `<h1>Password Reset Request</h1>
                <h2>Hello ${user.fullName}</h2>
                <p>You requested to reset your password.</p>
                <p> Please, click the link below to reset your password</p>
                <a href=${BaseUrl}/swagger/auth/resetPassword?token=${resetToken}&userId=${user.id}> Click here to reset password!</a>
                </div>`,
      };
      //localhost:3000/swagger/auth/resetPassword?token=81129669e5f97486d8de5e5178b9e352105e1c4e252ea11a4188d578a977ce4b&userId=63581447075b294c2885502f
      http: console.log(
        `link,${BaseUrl}/swagger/auth/resetPassword?token=${resetToken}&userId=${user.id}`
      );

      // sendEmail(user.fullName, user.email, content);
      return { message: "Reset link sent to your mail" };
    } 
    else {
      throw new BadRequestException();
    }
  }),
}

describe("PasswordsController", () => {
  let controller: PasswordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordsController],
      providers: [
        PasswordsService,
        TokensService,
        PrismaService
      ],
    })
    .overrideProvider(PasswordsService)
    .useValue(mockPasswordsService)
    .compile()

    controller = module.get<PasswordsController>(PasswordsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  })
})
