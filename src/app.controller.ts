import { Body, Controller, Get, Post, Query, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Information } from './Information.dto';
import { Response } from 'express';

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
  shopCheck(@Body() Information: Information, @Res() response: Response) {
    console.log(Information);
    let errors = [];

    if (!Information.name || !Information.address || !Information.baddress || !Information.card || !Information.expdate || !Information.code) {
      errors.push('Az összes mezőt (kivéve a kupon) ki kell tölteni.')
    }

    if (!/^\d{4}-\d{4}-\d{4}-\d{4} $/.test(Information.card)) {
      errors.push('Nem megfelelő formátum (kártya)');
    }

    if (Information.coupon && !/^[A-Z]{2}-\d{4}$/.test(Information.coupon)) {
      errors.push('Nem megfelelő formátum (kupon)');
    }

    if (!/^\d{2}-\d{2}$/.test(Information.expdate) && parseInt(Information.expdate.substring(3, 5)) < 24) {
      errors.push('Nem megfelelő formátum (lejárati dátum)');
    }

    if (!/^\d{3}$/.test(Information.code)) {
      errors.push('Nem megfelelő formátum (kód)');
    }

    if (errors.length > 0) {
      response.render('shopcheck', {
        data: Information,
        errors: errors
      });
      return;
    }
  }
}
