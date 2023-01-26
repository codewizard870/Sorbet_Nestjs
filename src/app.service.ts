import { Injectable } from "@nestjs/common";
import { PrismaService } from "./utils/prisma/prisma.service";

@Injectable()
export class AppService {
  constructor(
    private prismaService: PrismaService
  ) {}
  
  getHello(): string {
    return "Hello World!";
  }

  async resetDatabase() {
    this.prismaService.location.deleteMany();
    await this.prismaService.event.deleteMany();
    await this.prismaService.gig.deleteMany();
    await this.prismaService.user.deleteMany();
    await this.prismaService.post.deleteMany();
    return { message: "database reset successfully" };
  }
}
