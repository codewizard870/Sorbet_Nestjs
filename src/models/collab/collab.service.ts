import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateCollabDto } from "./dto/create-collab.dto";
import { UpdateCollabDto } from "./dto/update-collab.dto";

@Injectable()
export class CollabService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async create(data: CreateCollabDto) {
    try {
  
      const result = await this.prismaService.collab.create({
        data: {
          collabId: data.collabId,
          userId: data.userId,
          wallet_address: data.wallet_address,
          public_key: data.public_key,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now())
        },
      })
      if (result) {
        return result
      } 
      else {
        throw new BadRequestException('Failed creating collab')
      } 
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAll() {
    try {
      const allCollabs = await this.prismaService.collab.findMany({})
      if (allCollabs) {
        return allCollabs
      }
      else {
        throw new BadRequestException('Failed to find all collabs')
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(id: string) {
    try {
      const collab = await this.prismaService.collab.findFirst({
        where: { id: id },
      })
      if (collab) {
        return collab
      }
      else {
        throw new BadRequestException('Failed to find collab')
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findByUserId(userId: string) {
    try {
      const collab = await this.prismaService.collab.findFirst({
        where: { userId: userId},
      })
      if (collab) {
        return collab
      }
      else {
        throw new BadRequestException('Failed to find collab by userId')
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findByWalletAddress(walletAddress: string) {
    try {
      const collab = await this.prismaService.collab.findFirst({
        where: { wallet_address: walletAddress},
      })
      if (collab) {
        return collab
      }
      else {
        throw new BadRequestException('Failed to find collab by wallet address')
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findByPublicKey(publicKey: string) {
    try {
      const collab = await this.prismaService.collab.findFirst({
        where: { public_key: publicKey},
      })
      if (collab) {
        return collab
      }
      else {
        throw new BadRequestException('Failed to find collab by public key')
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async update(id: string, updateCollabDto: UpdateCollabDto) {
    try {
      const updatedCollab = await this.prismaService.collab.update({
        where: { id: id },
        data: updateCollabDto
      })
      if (updatedCollab) {
        return { message: `Successfully updated collab` }
      }
      else {
        throw new BadRequestException('Failed to updarte collab')
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async remove(id: string) {
    try {
      const removedCollab = await this.prismaService.collab.delete({
        where: { id: id },
      })
      if (removedCollab) {
        return { message: `Successfully deleted collab` }
      }
      else {
        return { message: `Failed to delete collab` }
      }
    } 
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }
}
