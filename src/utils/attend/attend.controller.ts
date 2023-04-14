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
  import { AttendService } from "./attend.service";
  import { CreateAttendDto } from "./dto/create-attending-dto";
  import { UpdateAttendDto } from "./dto/update-attending-dto";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
  
  @ApiBearerAuth()
  @ApiTags("Attend")
  @Controller("/attend")
  export class AttendController {
    constructor(private readonly attendService: AttendService) {}
  
    @Post('create')
    async create(@Body() createAttendDto: CreateAttendDto) {
      return await this.attendService.createAttend(createAttendDto)
    }

    @Get('/findAll')
    async findAll () {
      return await this.attendService.findAllAttends()
    }

    @Get(':id')
    async findOne (@Param("id") id: string) {
      return await this.attendService.findById(id)
    }

    @Get(':attendingUserId')
    async findByAttendingUserId (@Param("attendingUserId") attendingUserId: string) {
      return await this.attendService.findByAttendingUserId(attendingUserId)
    }

    @Get(':eventId')
    async findByEventId (@Param("eventId") eventId: string) {
      return await this.attendService.findByEventId(eventId)
    }

    @Patch(':id')
    async update (@Param("id") id: string, @Body() updateAttendDto: UpdateAttendDto) {
      return await this.attendService.updateAttend(updateAttendDto, id)
    }

    @Delete(':id')
    async remove (@Param("id") id: string) {
      return await this.attendService.removeAttend(id)
    }
  }
  