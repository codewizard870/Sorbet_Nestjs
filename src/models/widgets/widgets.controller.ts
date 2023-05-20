import {
    Controller,
    Get,
    Body,
    Patch,
    Delete,
    Post,
    Param,
    Query,
    Header
  } from "@nestjs/common";
  import { WidgetsService } from "./widgets.service";
  import { CreateWidgetDto } from "./dto/create-widgets-dto";
  import { UpdateWidgetDto } from "./dto/update-widgets-dto";
  import { ApiBearerAuth, ApiTags, ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";

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

    @Patch(':userId/reorder')
    @ApiOperation({ summary: 'Reorder widgets for a user' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiBody({ schema: { type: 'array', items: { type: 'object' } } })
    async reorder(@Param('userId') userId: string, @Body() updatedWidgetOrder: object[]): Promise<any> {
      return await this.widgetsService.reorderWidgets(userId, updatedWidgetOrder);
    }

    @Get("/getSoundcloudTrackId/:soundcloudUrl")
    getSoundcloudTrackId(@Param("soundcloudUrl") soundcloudUrl: string) {
      return this.widgetsService.getSoundcloudTrackId(soundcloudUrl)
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

    @Post("createSpotifyAccessToken")
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          spotifyCode: { type: 'string' },
          redirect_uri: { type: "string" }
        },
      },
    })
    createSpotifyAccessToken(@Body("spotifyCode") spotifyCode: string, @Body("redirect_uri") redirect_uri?: string): Promise<any> {
      return this.widgetsService.createSpotifyAccessToken(spotifyCode, redirect_uri)
    }

    @Post("createInstagramAccessToken")
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          instagramCode: { type: 'string' },
          redirect_uri: { type: "string" }
        },
      },
    })
    createInstagramAccessToken(@Body("instagramCode") instagramCode: string, @Body("redirect_uri") redirect_uri?: string): Promise<any> {
      return this.widgetsService.createInstagramAccessToken(instagramCode, redirect_uri)
    }
  }