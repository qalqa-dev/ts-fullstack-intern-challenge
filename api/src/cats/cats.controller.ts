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
    private readonly catsService: CatsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all likes for current user',
    type: [Like],
  })
  async listLikes(@Req() req: { user: User }) {
    const likes = await this.catsService.list(req.user);
    return { data: likes };
  }

  @Post()
  @ApiBody({ type: CreateLikeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Creates new like',
    type: Like,
  })
  async add(@Body() dto: { cat_id: string }, @Req() req: { user: User }) {
    const like = await this.catsService.newLike(dto, req.user);
    return like;
  }

  @Delete(':cat_id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Removes like for specified cat',
  })
  async drop(@Param('cat_id') cat_id: string, @Req() req: { user: User }) {
    await this.catsService.dropLike(cat_id, req.user);
    return { message: 'Like removed successfully' };
  }
}
