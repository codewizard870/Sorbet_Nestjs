import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { LocationsService } from "./locations.service";
import {
  CreateLocationDto,
  CreateMyLocationDto,
} from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public } from "src/utils/auth/constants";

@ApiBearerAuth()
@ApiTags("locations")
@Controller("/swagger/locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }
  @Post("createMyLocation")
  createMyLocation(
    @Request() req,
    @Body() createLocationDto: CreateMyLocationDto
  ) {
    return this.locationsService.createMyLocation(
      createLocationDto,
      req.user.id
    );
  }
  // @Public()
  //   @Get('testharversine')
  //   testHarvensine() {
  //     return this.locationsService.testHarversine();
  //   }

  // @Get()
  // findAll() {
  //   return this.locationsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.locationsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
  //   return this.locationsService.update(+id, updateLocationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.locationsService.remove(+id);
  // }
}
