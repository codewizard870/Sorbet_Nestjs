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
import { GlobalSearchService } from "./global-search.service";
import { CreateGlobalSearchDto } from "./dto/create-global-search.dto";
import { UpdateGlobalSearchDto } from "./dto/update-global-search.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  FindEventDistanceDto,
  FindGigDistanceDto,
  FindPostDistanceDto,
} from "./dto/find-distance.dto";
@ApiTags("Global Search")
@ApiBearerAuth()
@Controller("global-search")
export class GlobalSearchController {
  constructor(private readonly globalSearchService: GlobalSearchService) {}

  @Post("globalSearch/:text")
  async globalSearch(@Param("text") text: string) {
    return await this.globalSearchService.globalSearch(text);
  }

  @Post("globalSearchByDistance/:text/:distance")
  async globalSearchByDistance(
    @Request() req,
    @Param("text") text: string,
    @Param("distance") distance: string
  ) {
    return await this.globalSearchService.globalSearchByDistance(
      req.user.id,
      distance,
      text
    );
  }

  @Post("globalSearchEventByDistance/:text/:distance")
  async globalSearchEventByDistance(
    @Request() req,
    @Param("text") text: string,
    @Param("distance") distance: string
  ) {
    return await this.globalSearchService.globalSearchEventByDistance(
      req.user.id,
      distance,
      text
    );
  }
  @Post("globalSearchGigByDistance/:text/:distance")
  async globalSearchGigByDistance(
    @Request() req,
    @Param("text") text: string,
    @Param("distance") distance: string
  ) {
    return await this.globalSearchService.globalSearchGigByDistance(
      req.user.id,
      distance,
      text
    );
  }
  @Post("globalSearchLocationByDistance/:text/:distance")
  async globalSearchLocationByDistance(
    @Request() req,
    @Param("text") text: string,
    @Param("distance") distance: string
  ) {
    return await this.globalSearchService.globalSearchLocationByDistance(
      req.user.id,
      distance,
      text
    );
  }
  @Post("globalSearchPostByDistance/:text/:distance")
  async globalSearchPostByDistance(
    @Request() req,
    @Param("text") text: string,
    @Param("distance") distance: string
  ) {
    return await this.globalSearchService.globalSearchPostByDistance(
      req.user.id,
      distance,
      text
    );
  }
  @Post("globalSearchUserByDistance/:text/:distance")
  async globalSearchUserByDistance(
    @Request() req,
    @Param("text") text: string,
    @Param("distance") distance: string
  ) {
    return await this.globalSearchService.globalSearchUserByDistance(
      req.user.id,
      distance,
      text
    );
  }

  @Post("globalSearchLocationByDistanceWithoutText/:distance")
  async globalSearchLocationByDistanceWithoutText(
    @Request() req,
    @Param("distance") distance: string
  ) {
    return await this.globalSearchService.globalSearchLocationByDistanceWithoutText(
      req.user.id,
      distance
    );
  }

  ///to check distance between a loged in user and using eventID postID gigID userId
  //that the eventID postID gigID userId exists inside the inputted range or not from the loggedIn user
  @Post("findUserInDistance")
  async findUserInDistance(@Request() req, @Body() data: FindEventDistanceDto) {
    return await this.globalSearchService.findUserDistance(req.user.id, data);
  }

  @Post("findEventInDistance")
  async findEventInDistance(
    @Request() req,
    @Body() data: FindEventDistanceDto
  ) {
    return await this.globalSearchService.findEventDistance(req.user.id, data);
  }

  @Post("findGigInDistance")
  async findGigInDistance(@Request() req, @Body() data: FindGigDistanceDto) {
    return await this.globalSearchService.findGigDistance(req.user.id, data);
  }

  @Post("findPostInDistance")
  async findPostInDistance(@Request() req, @Body() data: FindPostDistanceDto) {
    return await this.globalSearchService.findPostDistance(req.user.id, data);
  }

  // @Get()
  // findAll() {
  //   return this.globalSearchService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.globalSearchService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGlobalSearchDto: UpdateGlobalSearchDto) {
  //   return this.globalSearchService.update(+id, updateGlobalSearchDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.globalSearchService.remove(+id);
  // }
}
