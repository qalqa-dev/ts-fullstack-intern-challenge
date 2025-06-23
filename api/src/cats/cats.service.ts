import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Like)
    private likesRepo: Repository<Like>,
  ) {}

  list(user: User) {
    return this.likesRepo.find({ where: { userId: user.id } });
  }
  async newLike(dto: { cat_id: string }, user: User) {
    const like = this.likesRepo.create({ cat_id: dto.cat_id, userId: user.id });
    return this.likesRepo.save(like);
  }
  async dropLike(cat_id: string, user: User) {
    const res = await this.likesRepo.delete({ cat_id, userId: user.id });
    if (!res.affected) throw new NotFoundException();
  }
}
