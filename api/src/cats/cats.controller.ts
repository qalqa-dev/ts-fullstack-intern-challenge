import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { CatsService } from './cats.service';
import { CreateLikeDto } from './create-like.dto';
import { Like } from './like.entity';

@ApiTags('Likes')
@UseGuards(AuthGuard)
@Controller('likes')
export class CatsController {
  constructor(
    private cs: CatsService,
    private auth: UsersService,
  ) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [Like] })
  listLikes(@Req() req) {
    const user: User = req.user;
    return { data: this.cs.list(user) };
  }

  @Post()
  @ApiBody({ type: CreateLikeDto })
  async add(@Body() dto: { cat_id: string }, @Req() req) {
    const like = await this.cs.newLike(dto, req.user);
    return { ...like };
  }

  @Delete(':cat_id')
  drop(@Param('cat_id') cat_id: string, @Req() req) {
    return this.cs.dropLike(cat_id, req.user);
  }
}
