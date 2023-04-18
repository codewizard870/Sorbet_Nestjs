import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request
  } from "@nestjs/common";
  import { ApplyService } from "./apply.service";
  import { CreateApplyDto } from "./dto/create-apply-dto";
  import { UpdateApplyDto } from "./dto/update-apply-dto";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
  
  @ApiBearerAuth()
  @ApiTags("Apply")
  @Controller("/apply")
  export class ApplyController {
    constructor(private readonly applyService: ApplyService) {}
  
    @Post('create')
    async create(@Body() createApplyDto: CreateApplyDto) {
      return await this.applyService.createApply(createApplyDto)
    }

    @Get('/findAll')
    async findAll () {
      return await this.applyService.findAllApplications()
    }

    @Get(':id')
    async findOne (@Param("id") id: string) {
      return await this.applyService.findById(id)
    }

    @Get(':appliedUserId')
    async findByAttendingUserId (@Param("appliedUserId") appliedUserId: string) {
      return await this.applyService.findByAppliedUserId(appliedUserId)
    }

    @Get(':gigId')
    async findByGigId (@Param("gigId") gigId: string) {
      return await this.applyService.findByGigId(gigId)
    }

    @Patch(':id')
    async update (@Param("id") id: string, @Body() updateApplyDto: UpdateApplyDto) {
      return await this.applyService.updateApply(updateApplyDto, id)
    }

    @Delete(':id')
    async remove (@Param("id") id: string) {
      return await this.applyService.removeApply(id)
    }
  }
  