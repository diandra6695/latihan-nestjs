import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from '@prisma/client';
import { ValidationFilter } from 'src/validation/validation.filter';
import {
  LoginUserRequest,
  loginUserRequestValidation,
} from 'src/model/login.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';

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

  @Get('/current')
  current(@Auth() user: User): Record<string, any> {
    return {
      data: `Hello ${user.first_name} ${user.last_name}`,
    };
  }

  @UsePipes(new ValidationPipe(loginUserRequestValidation))
  @UseFilters(ValidationFilter)
  @Post('/login')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(TimeInterceptor)
  login(@Body() request: LoginUserRequest) {
    return {
      data: `Hello ${request.username}`,
    };
  }

  @Get('/say/hello')
  // @UseFilters(ValidationFilter)
  async sayHello(@Query('name') name: string): Promise<string> {
    return this.service.sayHello('nandae');
  }

  // @Get('/ganteng')
  // hainda(
  //   @Query('name') name: string,
  //   @Query('alamat') alamat: string,
  //   @Query('citacita') citacita: string,
  //   @Query('sayasuka') sayasuka: string,
  //   @Query('inpomancing') inpomancing: string,
  // ): string {
  //   return `nama saya ${name}, alamat saya ${alamat}, citacita saya ${citacita}, saya suka ${sayasuka}, inpo mancing? ${inpomancing}`;
  // }
  @Get('/:id')
  get(@Param('id', ParseIntPipe) id: string): string {
    return `request: ${id}`;
  }

  @Get('/connection')
  async getConnection(): Promise<string> {
    this.mailService.send();
    this.emailService.send();

    console.info(this.memberService.getConnectionName());
    this.memberService.sendEmail();

    return this.connection.getName();
  }

  @Get('/create')
  async create(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName?: string,
  ): Promise<User> {
    if (!firstName) {
      throw new HttpException(
        {
          code: 400,
          errors: 'first_name is required',
        },
        400,
      );
    }
    return this.userRepository.save(firstName, lastName);
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
}
