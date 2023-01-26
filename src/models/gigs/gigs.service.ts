import { Injectable } from "@nestjs/common";
import { TimezonesService } from "src/timezones/timezones.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreateGigDto } from "./dto/create-gig.dto";
import { UpdateGigDto } from "./dto/update-gig.dto";

@Injectable()
export class GigsService {
  constructor(
    private prismaService: PrismaService,
    private timezonesService: TimezonesService
  ) {}

  async create(data: CreateGigDto) {
    try {
      const utcStartDate = this.timezonesService.convertToUtc(data.start_date);
      const utcEndDate = this.timezonesService.convertToUtc(data.end_date);
      const result = await this.prismaService.gig.create({
        data: {
          postId: data.postId,
          timezone: data.timezone,
          start_date: utcStartDate,
          end_date: utcEndDate,
          title: data.title,
          description: data.description,
          gig_price_min: data.gig_price_min,
          gig_price_max: data.gig_price_max,
          tags: data.tags,
        },
      });
      if (result) {
        return result;
      } 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAll() {
    try {
      return await this.prismaService.gig.findMany({
        include: { location: true },
      })
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(_id: string) {
    try {
      const gig = await this.prismaService.gig.findFirst({
        where: { id: _id },
        include: { location: true },
      });
      return gig;
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  update(id: number, updateGigDto: UpdateGigDto) {
    return `This action updates a #${id} gig`;
  }

  remove(id: number) {
    return `This action removes a #${id} gig`;
  }
}
