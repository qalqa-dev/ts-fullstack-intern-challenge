import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user.dto';
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
  @ApiResponse({ status: HttpStatus.OK, type: [User] })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('register')
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() dto: CreateUserDto, @Res() res) {
    try {
      const { user, token } = await this.usersService.create(
        dto.login,
        dto.password,
      );
      const apiKey = this.configService.get<string>('CAT_API_KEY');
      res.setHeader('X-Auth-Token', token);

      return res.status(HttpStatus.CREATED).json({
        user,
        api_key: apiKey,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: error.message,
        });
      }
      throw error;
    }
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async loginUser(@Body() dto: LoginUserDto, @Res() res) {
    try {
      const { user, token } = await this.usersService.login(
        dto.login,
        dto.password,
      );
      const apiKey = this.configService.get<string>('CAT_API_KEY');
      res.setHeader('X-Auth-Token', token);
      return res.status(HttpStatus.OK).json({
        user,
        api_key: apiKey,
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Body() body: { token: string }, @Res() res) {
    const success = await this.usersService.logout(body.token);

    if (success) {
      return res.json({ message: 'Successfully logged out' });
    } else {
      return res.status(400).json({ message: 'Invalid token' });
    }
  }

  @Post('validate')
  @UseGuards(AuthGuard)
  async validate(@Res() res) {
    return res.json({ message: 'Token is valid' });
  }
}
