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
          collabId: '',
          userId: '',
          wallet_address: '',
          public_key: '',
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now())
        },
      });
      if (result) {
        return result;
      } 
      else {
        throw new BadRequestException();
      } 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAll() {
    try {
        return await this.prismaService.collab.findMany({})
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(_id: string) {
    try {
      const event = await this.prismaService.collab.findFirst({
        where: { id: _id },
      });
      return event;
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  update(id: string, updateCollabDto: UpdateCollabDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: string) {
    return `This action removes a #${id} event`;
  }
}
