import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
  } from "@nestjs/common";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
  import { NearService } from "./near.service";
  
  @ApiBearerAuth()
  @ApiTags("Near")
  @Controller("near")
  export class NearController {
    constructor(private readonly nearService: NearService) {}

    @Get('/getUpdatedPrice')
    async getUpdatedPrice() {
        return await this.nearService.getNearCoinPrice()
    }
  }
  