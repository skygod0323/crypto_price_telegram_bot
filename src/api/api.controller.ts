import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';


@Controller('api/bot')
@ApiTags('Api')
@ApiBearerAuth()
export class ApiController {

  constructor(
  ) {
  }

  @Get()
  @ApiOkResponse()
  async get_telegram_bot(body) {
      console.log(body);

      return 'success';
  }

  @Post()
  @ApiOkResponse()
  async telegram_bot_req(body: string) {
      console.log(body);

      return 'success';
  }
}
