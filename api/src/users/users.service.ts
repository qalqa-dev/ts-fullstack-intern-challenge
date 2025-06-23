import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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
    private jwtService: JwtService,
  ) {}

  private generateJwtToken(user: User): string {
    const payload = {
      sub: user.id,
      login: user.login,
    };
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN') || '1h',
    });
  }

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

    const token = this.generateJwtToken(user);

    return { user, token };
  }

  async login(
    login: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const hash = crypto
      .createHash('sha256')
      .update(password + this.config.get('SECRET_SALT'))
      .digest('hex');

    const user = await this.usersRepo.findOne({
      where: {
        login,
        passwordHash: hash,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateJwtToken(user);
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
