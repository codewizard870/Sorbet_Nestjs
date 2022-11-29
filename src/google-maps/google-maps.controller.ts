import { Controller } from "@nestjs/common";
import { GoogleMapsService } from "./google-maps.service";

@Controller("google-maps")
export class GoogleMapsController {
  constructor(private readonly googleMapsService: GoogleMapsService) {}

  // @Public()
  // @Post()
  // async create(@Body() createGoogleMapDto: CreateGoogleMapDto) {
  //   return await this.googleMapsService.getCoordinates(createGoogleMapDto);
  // }
}
