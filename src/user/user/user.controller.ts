import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';

type TypeBody = {
  nama: string;
  email: string;
};

@Controller('api/users')
export class UserController {
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepository: UserRepository,
    private memberService: MemberService,
  ) {}

  @Get('/connection')
  async getConnection(): Promise<string> {
    this.userRepository.save();
    this.mailService.send();
    this.emailService.send();

    console.info(this.memberService.getConnectionName());
    this.memberService.sendEmail();

    return this.connection.getName();
  }

  @Get('/hello')
  sayHello(@Query('name') name: string): string {
    return this.service.sayHello(name);
  }

  @Get('set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send('success set cookie');
  }

  @Get('view/hello')
  viewHello(@Query('name') name: string, @Res() response: Response) {
    response.render('index.html', {
      title: 'Template Engine',
      name: name,
    });
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

  @Get('/:id')
  get(@Param('id') id: string): string {
    return `request: ${id}`;
  }
}
