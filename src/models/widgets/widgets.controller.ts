import {
    Controller,
    Get,
    Body,
    Request,
    Patch,
    Delete,
    Post,
    Response
  } from "@nestjs/common";
  import { WidgetsService } from "./widgets.service";
  import { CreateWidgetDto } from "./dto/create-widgets-dto";
  import { UpdateWidgetDto } from "./dto/update-widgets-dto";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

  @ApiTags("users")
    @Controller("/swagger/widgets")
    @ApiBearerAuth()
    export class WidgetsController {
    constructor(private readonly widgetsService: WidgetsService) {}
        @Post("createWidget")
        async create(@Body() data: CreateWidgetDto) {
            return await this.widgetsService.create(data)
        }
        
        @Get("getWidgetById")
        async getWidgetById(@Body() id: string) {
            return await this.widgetsService.getWidgetById(id)
        }

        @Get("getWidgetsByUserId")
        async getWidgetsByUserId(@Body() userId) {
            return await this.widgetsService.getWidgetsByUserId(userId)
        }

        @Get("getWidgetFromImage")
        async getWidgetFromImage(@Body() image: string) {
            return await this.widgetsService.getWidgetFromImage(image)
        }

        @Get("getWidgetFromNFTMetadata")
        async getWidgetFromNFTMetadata(@Body() nft_metadata: string) {
            return await this.widgetsService.getWidgetFromNFTMetadata(nft_metadata)
        }

        @Get("getWidgetFromProjectLink")
        async getWidgetFromProjectLink(@Body() project_link: string) {
            return await this.widgetsService.getWidgetFromProjectLink(project_link)
        }

        @Get("getAll")
        async getAll() {
            return await this.widgetsService.getAll()
        }

        @Patch('update')
        async update(@Request() req, @Body() updateWidgetDto: UpdateWidgetDto) {
            return await this.widgetsService.update(
                req.user.id,
                updateWidgetDto
            )
        }

        @Delete("delete")
        delete(@Request() req) {
            return this.widgetsService.delete(req.user.id);
        }

        @Post('createDribbleAccessToken')
        async createDribbleAccessToken(@Body() dribbbleCode: string) {
            return await this.widgetsService.createDribbleAccessToken(dribbbleCode)
        }
    }