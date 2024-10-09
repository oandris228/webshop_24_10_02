import { Body, Controller, Get, Post, Query, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Information } from './Information.dto';
import { Response } from 'express';
import { SpecInformation } from './SpecInformation.dto';

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

  @Get('shopSpecific')
  @Render('specificform')
  specificForm() {
    console.log("működik")
    return {
      data: {},
      errors: []
    }
  }

  @Post('shopSpecific')
  specificCheck(@Body() Information: SpecInformation, @Res() response: Response) {
    console.log(Information);
    let errors = [];

    if (!Information.bankcode || !Information.name) {
      errors.push('Az összes mezőt ki kell tölteni.');
    }

    if (!/[A-Z]/.test(Information.name)) {
      errors.push('A név formátuma helytelen.');
    }

    if (!/^\d{8}-\d{8}$/.test(Information.bankcode) && !/^\d{8}-\d{8}-\d{8}$/.test(Information.bankcode)) {
      errors.push('A bankszámla formátuma helytelen.');
    }

    if (!Information.checked) {
      errors.push('A felhasználási feltételek el kell fogadni.');
    }

    const fs = require('node:fs');
    const content = Information.name + ";" + Information.bankcode + "\n";

    if (errors.length == 0) {
      fs.writeFileSync('./src/content.csv', content, {flag: "a+"}, err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
        }
      });
    }

    if (errors.length > 0) {
      response.render('specificform', {
        data: Information,
        errors: errors
      });
      return;
    }
  }
}
