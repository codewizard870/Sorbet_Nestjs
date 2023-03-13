import {
    Controller,
    Get,
    Body,
    Patch,
    Delete,
    Post,
    Param,
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
        
        @Get("getWidgetById/:id")
        async getWidgetById(@Param() id: string) {
            return await this.widgetsService.getWidgetById(id)
        }

        @Get("getWidgetsByUserId/:userId")
        async getWidgetsByUserId(@Param() userId: string) {
            return await this.widgetsService.getWidgetsByUserId(userId)
        }

        @Get("getAll")
        async getAll() {
            return await this.widgetsService.getAll()
        }

        @Patch(':id/update')
        async update(@Param() id: string, @Body() updateWidgetDto: UpdateWidgetDto) {
            return await this.widgetsService.update(
                id,
                updateWidgetDto
            )
        }

        @Delete(":id/delete")
        delete(@Param() id: string) {
            return this.widgetsService.delete(id)
        }

        @Post('createDribbleAccessToken')
        async createDribbleAccessToken(@Body() dribbbleCode: string) {
            return await this.widgetsService.createDribbleAccessToken(dribbbleCode)
        }
    }