import { Module } from "@nestjs/common";
import { JobProfileService } from "./job-profile.service";
import { JobProfileController } from "./job-profile.controller";
import { PrismaService } from "src/utils/prisma/prisma.service";

@Module({
  controllers: [JobProfileController],
  providers: [JobProfileService, PrismaService],
})
export class JobProfileModule {}
