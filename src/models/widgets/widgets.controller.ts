import {
    Controller,
    Get,
    Body,
    Request,
    Patch,
    Delete,
    Post,
    Param,
    Response
  } from "@nestjs/common";
  import { WidgetsService } from "./widgets.service";
  import { CreateWidgetDto } from "./dto/create-widgets-dto";
  import { UpdateWidgetDto } from "./dto/update-widgets-dto";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

  @ApiTags("users")
    @Controller("/widgets")
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
        async getWidgetsByUserId(@Body() userId: string) {
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

        @Get("getAll")
        async getAll() {
            return await this.widgetsService.getAll()
        }

        @Patch(':id/update')
        async update(@Param() id, @Body() updateWidgetDto: UpdateWidgetDto) {
            return await this.widgetsService.update(
                id,
                updateWidgetDto
            )
        }

        @Delete(":id/delete")
        delete(@Param() id,) {
            return this.widgetsService.delete(id)
        }

        @Post('createDribbleAccessToken')
        async createDribbleAccessToken(@Body() dribbbleCode: string) {
            return await this.widgetsService.createDribbleAccessToken(dribbbleCode)
        }
    }