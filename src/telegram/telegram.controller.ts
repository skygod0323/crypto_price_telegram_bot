import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Res,
  HttpStatus,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import * as fs from 'fs';
import { TelegramService } from './telegram.service';
import axios from 'axios';

import * as dotenv from 'dotenv';

dotenv.config();

const APP_URL = process.env.APP_URL;
const BSC_KEY = process.env.BSC_KEY;

const formatDate = (d) =>
  `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

@Controller('api/bot')
@ApiTags('Api')
@ApiBearerAuth()
export class TelegramController {
  constructor(private telegramService: TelegramService) {}

  @Get()
  async getBotDialog(@Res() res) {
    // this.telegramService
    //   .generateImage(true)
    //   .then((path) => {
    //     console.log('path = ', path);
    //   })
    //   .catch((e) => {
    //     console.log('root ', e);
    //   });
    // const token = await this.telegramService.addToken({network: 'binance_smart_chain', address: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402'});
    // console.log(token);

    
  }

  @Get('uploads/:fileName')
  image(@Param('fileName') fileName: string, @Res() response) {
    try {
      const buffer = fs.readFileSync(
        `${__dirname}/../../public/uploads/${fileName}.png`,
      );
      response.writeHead(200, { 'Content-Type': 'image/png' });
      response.end(buffer);
    } catch (e) {
      console.log('e');
      throw new NotFoundException(
        'Image not found. Please wait for a while for the chart to be generated.',
      );
    }
  }

  @Post()
  @ApiOkResponse()
  async telegram_bot_req(@Body() body: any, @Res() res) {
    const msg = body.message.text;
    const group = body.message.chat.id;
    console.log(body, group);

    

    try {
      
      if (msg.indexOf('/marco') >= 0) {
        const param = {
          chat_id: body.message.chat.id,
          text: 'Marco message',
        };

        await this.sendMessage(param);

        return res.end('ok');

      } else if (msg.indexOf('/set_token') >= 0) {

        const tokenAddress = msg.substr(11);
        
        const token = await this.telegramService.setToken({
          group: group,
          network: 'bsc',
          address: tokenAddress,
        });
        console.log(token);

        const param = {
          chat_id: body.message.chat.id,
          text: 'Token Successfully Added',
        };

        this.telegramService.handleFunction();

        await this.sendMessage(param);
    
        return res.end('ok');
      } else if (msg.indexOf('/price') >= 0) {

        const token = await this.telegramService.getTokenInfoByGroupId(group);

        let base_price;
        if (token.network == 'bsc') {
          const now = new Date();
          const apiUrl = `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${BSC_KEY}`
          let res = await axios.get(apiUrl);
          base_price = res.data.result.ethusd;
        }

        let market_cap: any = Number(token.price) * Number(token.supply);
        market_cap = market_cap.toFixed(3);

        const text = `<b><a href="${APP_URL}api/bot/uploads/chart-${group}">price chart</a></b>

Token: <b>${token.name}(${token.symbol})</b>
Price: <b>$${token.price}</b>
Total Supply: <b>${token.supply}</b>
Market Cap: <b>$${market_cap}</b>
BNB Price: <b>${base_price}</b>

Contract Address: ${token.address}
                  `;


        console.log(text);
        const param = {
          chat_id: body.message.chat.id,
          parse_mode: 'html',
          disable_web_page_preview: false,
          text: text,
        };

        await this.sendMessage(param);

        return res.end('ok');
      }
    } catch (e) {
      console.log('error');
      console.log(e);
      return res.end();
    }

    return res.end();
  }

  sendMessage(param) {
    return axios.post(
      'https://api.telegram.org/bot2145651894:AAHRFtKUvrFNArD-bmd3xZm_90lKaNN2lAY/sendMessage',
      param,
    );
  }

  sendPhoto(param) {
    return axios.post(
      'https://api.telegram.org/bot2145651894:AAHRFtKUvrFNArD-bmd3xZm_90lKaNN2lAY/sendphoto',
      param,
    );
  }
}
