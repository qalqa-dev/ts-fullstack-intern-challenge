import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('register')
  @ApiBody({
    type: CreateUserDto,
  })
  async createUser(@Body() dto: CreateUserDto, @Res() res) {
    const { user, token } = await this.usersService.create(
      dto.login,
      dto.password,
    );
    const apiKey = this.configService.get<string>('CAT_API_KEY');
    res.setHeader('X-Auth-Token', token);
    return res.json({ api_key: apiKey });
  }
}
