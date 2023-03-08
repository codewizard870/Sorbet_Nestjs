import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from "@nestjs/common";
import { JobProfileService } from "./job-profile.service";
import { CreateJobProfileDto } from "./dto/create-job-profile.dto";
import { UpdateJobProfileDto } from "./dto/update-job-profile.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiTags("Job Profile")
@ApiBearerAuth()
@Controller("/swagger/job-profile")
export class JobProfileController {
  constructor(private readonly jobProfileService: JobProfileService) {}

  @Post()
  create(@Body() createJobProfileDto: CreateJobProfileDto, @Request() req) {
    return this.jobProfileService.create(createJobProfileDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.jobProfileService.getAll();
  }

  @Get("/jobId/:jobId")
  findOne(@Param("jobId") jobId: string) {
    return this.jobProfileService.getFromJobId(jobId);
  }

  @Get("/jobName/:jobName")
  getFromJobName(@Param("jobName") jobName: string) {
    return this.jobProfileService.getFromJobName(jobName);
  }

  @Get("myProfile")
  getFromUserId(@Request() req) {
    return this.jobProfileService.getFromUserId(req.user.id);
  }

  @Get("/jobType/:jobType")
  getFromJobType(@Param("jobType") jobType: string) {
    return this.jobProfileService.getFromJobType(jobType);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.jobProfileService.remove(id);
  }
}
