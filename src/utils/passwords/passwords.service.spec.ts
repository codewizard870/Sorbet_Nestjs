import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
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
                <a href=${BaseUrl}/api/auth/resetPassword?token=${resetToken}&userId=${user.id}> Click here to reset password!</a>
                </div>`,
      };
      //localhost:3000/api/auth/resetPassword?token=81129669e5f97486d8de5e5178b9e352105e1c4e252ea11a4188d578a977ce4b&userId=63581447075b294c2885502f
      http: console.log(
        `link,${BaseUrl}/api/auth/resetPassword?token=${resetToken}&userId=${user.id}`
      );

      // sendEmail(user.fullName, user.email, content);
      return { message: "Reset link sent to your mail" };
    } 
    else {
      throw new BadRequestException();
    }
  }),

  resetPassword: jest.fn().mockImplementation(async (userId: string, token: string, password: string) => {
    const passwordResetToken = await mockTokensService.getTokenByUserId(
      userId
    );

    if (!passwordResetToken) {
      throw new BadRequestException("Invalid or expired password reset token");
    }

    const isValid = await mockPasswordsService.comparePassword(token, passwordResetToken.token);

    if (!isValid) {
      throw new BadRequestException("Invalid or expired password reset token");
    }

    const hash = await mockPasswordsService.hashPassword(password);

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { password: hash },
    });
    if (user) {
      const content = {
        subject: "Password Reset Successfully",
        html: `<h1>Password Reset Successfully</h1>
                <h2>Hello ${user.firstName}</h2>
                <p>Your password has been changed successfully</p>`,
      };

      sendEmail(user.firstName, user.email, content);
      await mockTokensService.deleteToken(passwordResetToken.id);
      return { message: "Password Reset Successfully" };
    }
  })
}

describe("PasswordsService", () => {
  let service: PasswordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordsService, 
        TokensService, 
        PrismaService
      ],
    })
    .overrideProvider(PasswordsService)
    .useValue(mockPasswordsService)
    .compile()

    service = module.get<PasswordsService>(PasswordsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should define a function to hash the password", () => {
    expect(service.hashPassword).toBeDefined()
  })

  let hash: string
  it("should hash the password", async () => {
    const hashedPassword = await service.hashPassword('password')
    hash = hashedPassword
    expect(hashedPassword).toEqual(
      expect.any(String)
    )
    expect(hashedPassword).toHaveLength(60)
  })

  it("should define a function to compare the password and hash", () => {
    expect(service.comparePassword).toBeDefined()
  })

  it("should compare the password and hash", async () => {
    const passwordComparison = await service.comparePassword('password', hash)
    console.log(passwordComparison)
    expect(passwordComparison).toEqual(
      expect.any(Boolean)
    )
    expect(passwordComparison).toEqual(true)
  })

  it("should define a function to request a password reset", () => {
    expect(service.requestPasswordReset).toBeDefined()
  })

  it("should request a password reset", async () => {
    // const passwordResetRequested = await service.requestPasswordReset({})
    // console.log(passwordResetRequested)
  })

  it("should define a function to reset a password", () => {
    expect(service.resetPassword).toBeDefined()
  })

  it("should reset a password", async () => {
    // const passwordReset = await service.resetPassword('userId', 'token', 'password')
    // console.log(passwordResetRequested)
  })
})
