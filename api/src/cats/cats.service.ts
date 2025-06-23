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

  async list(user: User): Promise<Like[]> {
    return this.likesRepo.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
  }

  async newLike(dto: { cat_id: string }, user: User): Promise<Like> {
    const like = this.likesRepo.create({
      cat_id: dto.cat_id,
      user: user,
    });
    return this.likesRepo.save(like);
  }

  async dropLike(cat_id: string, user: User): Promise<void> {
    const result = await this.likesRepo.delete({
      cat_id,
      user: { id: user.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Like not found');
    }
  }
}
