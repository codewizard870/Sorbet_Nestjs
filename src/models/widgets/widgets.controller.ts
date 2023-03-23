import {
    Controller,
    Get,
    Body,
    Patch,
    Delete,
    Post,
    Param,
    Query
  } from "@nestjs/common";
  import { WidgetsService } from "./widgets.service";
  import { CreateWidgetDto } from "./dto/create-widgets-dto";
  import { UpdateWidgetDto } from "./dto/update-widgets-dto";
  import { ApiBearerAuth, ApiTags, ApiBody } from "@nestjs/swagger";

    @ApiTags("Widgets")
    @Controller("/widgets")
    export class WidgetsController {
    constructor(private readonly widgetsService: WidgetsService) {}
    @Post("create")
    async create(@Body() data: CreateWidgetDto) {
      return await this.widgetsService.create(data)
    }
  
    @Get("findAll")
    findAll() {
      return this.widgetsService.findAll()
    }

    @Get("findAllByType/:type")
    findAllByType(@Param("type") type: string) {
      return this.widgetsService.findAllByType(type)
    }
  
    @Get(":id")
    findOne(@Param("id") id: string) {
      return this.widgetsService.findOne(id)
    }

    @Get("findByUserId/:userId")
    findByUserId(@Param("userId") userId: string) {
      return this.widgetsService.findByUserId(userId)
    }
  
    @Patch(":id")
    update(@Param("id") id: string, @Body() updateWidgetDto: UpdateWidgetDto) {
      return this.widgetsService.update(id, updateWidgetDto)
    }
  
    @Delete(":id")
    remove(@Param("id") id: string) {
      return this.widgetsService.remove(id)
    }

    @Delete("deleteByIndex/:userId/:widgetIndex")
    deleteWidgetByIndex(@Param("userId") userId: string, @Param("widgetIndex") widgetIndex: string) {
      return this.widgetsService.deleteByIndex(userId, widgetIndex)
    }

    @Post("createDribbbleAccessToken")
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          dribbbleCode: { type: 'string' }
        },
      },
    })
    createDribbbleAccessToken(@Body("dribbbleCode") dribbbleCode: string ) {
      return this.widgetsService.createDribbbleAccessToken(dribbbleCode)
    }

    @Post("createGithubAccessToken")
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          githubCode: { type: 'string' }
        },
      },
    })
    createGithubAccessToken(@Body("githubCode") githubCode: string ) {
      return this.widgetsService.createGithubAccessToken(githubCode)
    }
  }