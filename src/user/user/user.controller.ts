import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';

type TypeBody = {
  nama: string;
  email: string;
};

@Controller('api/users')
export class UserController {
  @Get('set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send('success set cookie');
  }

  @Get('get-cookie')
  getCookie(@Req() request: Request) {
    return request.cookies['name'];
  }

  @Post('set-cookie')
  setCookiePost(@Body() body: TypeBody, @Res() response: Response) {
    response.cookie('name', body.nama);
    response.status(200).send('success set cookie');
  }

  @Post()
  post(): string {
    return 'post';
  }
  @Post('hello')
  helloPost(@Body() body: TypeBody): string {
    return `Hello ${body.nama} email : ${body.email}`;
  }

  @Get('sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  sampleResponse(): Record<string, string> {
    return {
      message: 'Hello World!',
    };
  }

  @Get('test')
  test(): string {
    return 'test';
  }

  @Get('/hello')
  sayHello(@Query('name') name: string): string {
    return `Hello ${name || 'guset'}`;
  }
  @Get('/:id')
  get(@Param('id') id: string): string {
    return `request: ${id}`;
  }
}
