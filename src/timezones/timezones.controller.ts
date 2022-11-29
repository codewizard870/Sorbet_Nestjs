import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TimezonesService } from "./timezones.service";
import { CreateTimezoneDto } from "./dto/create-timezone.dto";
import { UpdateTimezoneDto } from "./dto/update-timezone.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public } from "src/utils/auth/constants";

@ApiBearerAuth()
@ApiTags("timezones")
@Controller("/api/timezones")
export class TimezonesController {
  constructor(private readonly timezonesService: TimezonesService) {}

  @Public()
  @Post()
  create(@Body() createTimezoneDto: CreateTimezoneDto) {
    return this.timezonesService.create(createTimezoneDto);
  }

  @Get()
  findAll() {
    return this.timezonesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.timezonesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTimezoneDto: UpdateTimezoneDto
  ) {
    return this.timezonesService.update(+id, updateTimezoneDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.timezonesService.remove(+id);
  }
}
