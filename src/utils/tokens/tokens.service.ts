import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateTokenDto } from "./dto/create-token.dto";
import { UpdateTokenDto } from "./dto/update-token.dto";

@Injectable()
export class TokensService {
  constructor(private prismaService: PrismaService) {}

  async getTokenByUserId(userId: string) {
    try {
      const token = await this.prismaService.token.findFirst({
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
  }

  async createTokenByUserId(_id: string, hash: string) {
    try {
      const token = await this.prismaService.token.create({
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
  }

  async deleteToken(id: string) {
    try {
      return await this.prismaService.token.delete({
        where: {
          userId: id,
        },
      });
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }
}
