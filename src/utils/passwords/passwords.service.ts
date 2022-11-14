import { BadGatewayException, BadRequestException, HttpException, ImATeapotException, Injectable } from '@nestjs/common';
import { ApiBadGatewayResponse } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import * as crypto from "crypto";
import { sendEmail } from 'src/utils/auth/constants';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { TokensService } from 'src/utils/tokens/tokens.service';
const saltOrRounds = 8;
import * as dotenv from 'dotenv';
dotenv.config()

const BaseUrl = process.env.BASEURL;
@Injectable()
export class PasswordsService {
  constructor(
    private prismaService: PrismaService,
    private tokensService: TokensService
  ) { }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, saltOrRounds);
  }
  async comparePassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }


  async requestPasswordReset(user) {

    const token = await this.tokensService.getTokenByUserId(user._id);
    if (token) {
      await this.tokensService.deleteToken(token.id);
    }

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = bcrypt.hashSync(resetToken, 8);
    const result = await this.tokensService.createTokenByUserId(user.id, hash)
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
      http://localhost:3000/api/auth/resetPassword?token=81129669e5f97486d8de5e5178b9e352105e1c4e252ea11a4188d578a977ce4b&userId=63581447075b294c2885502f
      console.log(`link,${BaseUrl}/api/auth/resetPassword?token=${resetToken}&userId=${user.id}`);

      // sendEmail(user.fullName, user.email, content);
      return { message: "Reset link sent to your mail" }
    } else {
      throw new BadRequestException();
    }

  }

  async resetPassword(userId, token, password) {
    const passwordResetToken = await this.tokensService.getTokenByUserId(userId);

    if (!passwordResetToken) {
      throw new BadRequestException("Invalid or expired password reset token");
    }

    const isValid = await this.comparePassword(token, passwordResetToken.token);

    if (!isValid) {
      throw new BadRequestException("Invalid or expired password reset token");
    }

    const hash = await this.hashPassword(password);

    const user = await this.prismaService.user.update({
      where: {
        id: userId
      },
      data: { password: hash }
    })
    if (user) {
      const content = {
        subject: "Password Reset Successfully",
        html: `<h1>Password Reset Successfully</h1>
                <h2>Hello ${user.firstName}</h2>
                <p>Your password has been changed successfully</p>`,
      };

      sendEmail(user.firstName, user.email, content);
      await this.tokensService.deleteToken(passwordResetToken.id);
      return { message: "Password Reset Successfully" };
    }
  };

}