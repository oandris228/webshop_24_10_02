import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { query } from 'express';

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

  @Get('shopFood/:index')
  @Render('shopperform')
  shopperForm(@Query("food") food : string) {

    console.log(food);
    return {
      
    }
  }
}
