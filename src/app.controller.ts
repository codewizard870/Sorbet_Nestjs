import { Controller, Delete, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './utils/auth/constants';

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  
  @Delete('Reset')
  async delete() {
    return await this.appService.resetDatabase();
  }
}
