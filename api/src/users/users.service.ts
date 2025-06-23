import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private config: ConfigService,
  ) {}

  async create(
    login: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const hash = crypto
      .createHash('sha256')
      .update(password + this.config.get('SECRET_SALT'))
      .digest('hex');

    const user = this.usersRepo.create({ login, passwordHash: hash });
    await this.usersRepo.save(user);

    const token = crypto
      .createHash('sha256')
      .update(user.id + this.config.get('SECRET_SALT'))
      .digest('hex');

    return { user, token };
  }

  async validateToken(token: string): Promise<User | null> {
    const users = await this.usersRepo.find();
    const matched = users.find(
      (u) =>
        crypto
          .createHash('sha256')
          .update(u.id + this.config.get('SECRET_SALT'))
          .digest('hex') === token,
    );
    return matched || null;
  }
  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }
}
