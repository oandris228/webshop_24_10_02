import { Body, Controller, Get, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Information } from './Information.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('shopCheck')
  @Render('shopcheck')
  shopperForm() {
    console.log("heuehue")
    return {
      data: {},
      errors: []
    }
  }

  @Post('shopCheck')
  shopCheck(@Body() Information: Information) {
    console.log(Information)
  }
}
