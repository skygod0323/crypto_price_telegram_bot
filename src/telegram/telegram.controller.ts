import { Body, Controller, Get, Post, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { TelegramService } from './telegram.service';
const axios = require("axios")


@Controller('api/bot')
@ApiTags('Api')
@ApiBearerAuth()
export class TelegramController {

  constructor(
    private telegramService: TelegramService
  ) {
  }

  @Get()
  getBotDialog(@Res() res) {
    this.telegramService.generateImage(true).then(path => {
      console.log('path = ', path);
    }).catch(e => {
      console.log('root ', e);
    })
  }

  @Get('chart')
  async getImage(@Res() response) {
    try {
      const path = await this.telegramService.generateImage(true);
      console.log('path = ', path);
      const buffer = fs.readFileSync(path);
      response.writeHead(200, { 'Content-Type': 'image/png' });
      response.end(buffer);
    } catch(e) {
      response.end();
    }
    
  }


  @Post()
  @ApiOkResponse()
  async telegram_bot_req(@Body() body: any, @Res() res) {
    
    const msg = body.message.text;

    try {
      if (msg.indexOf('/marco') >= 0) {
        const param = {
          chat_id: body.message.chat.id,
          text: 'Marco message',
        }  
  
        await this.sendMessage(param);
  
        return res.end('ok');
      } else if (msg.indexOf('/set_token') >= 0) {
        const param = {
          chat_id: body.message.chat.id,
          text: 'This is token setting message',
        }  
  
        await this.sendMessage(param);
  
        return res.end('ok');
      } else if (msg.indexOf('/price') >= 0) {
        console.log(msg);
        const param = {
          chat_id: body.message.chat.id,
          parse_mode: 'html',
          disable_web_page_preview: false,
          text: `<a href="https://01ff-188-43-136-33.ngrok.io/api/bot/chart">price</a>
                  `,
        }  
  
        await this.sendMessage(param);
  
        return res.end('ok');
      }
    } catch(e) {
      console.log('error');
      console.log(e);
      return res.end()
    }

    

    return res.end();
  }

  sendMessage(param) {
    return axios
		.post(
			"https://api.telegram.org/bot2145651894:AAHRFtKUvrFNArD-bmd3xZm_90lKaNN2lAY/sendMessage",
			param
		)
  }
}
