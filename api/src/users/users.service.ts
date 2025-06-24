import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
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

  private async generateJwtToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      login: user.login,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN') || '1h',
    });

    const decoded = this.jwtService.decode(token);
    user.token = token;
    user.tokenExpiresAt = new Date(decoded['exp'] * 1000);
    await this.usersRepo.save(user);

    return token;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async create(login: string, password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const user = this.usersRepo.create({ login, passwordHash: hash });
    await this.usersRepo.save(user);

    const token = await this.generateJwtToken(user);
    return { user, token };
  }

  async login(login: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { login } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateJwtToken(user);
    return { user, token };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const user = await this.usersRepo.findOne({
        where: { token },
      });

      if (!user) return null;

      const payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      return user;
    } catch (e) {
      await this.clearInvalidToken(token);
      return null;
    }
  }

  async logout(token: string): Promise<boolean> {
    const user = await this.usersRepo.findOne({ where: { token } });

    if (user) {
      user.token = null;
      user.tokenExpiresAt = null;
      await this.usersRepo.save(user);
      return true;
    }
    return false;
  }

  private async clearInvalidToken(token: string): Promise<void> {
    await this.usersRepo.update(
      { token },
      { token: null, tokenExpiresAt: null },
    );
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.usersRepo
      .createQueryBuilder()
      .update(User)
      .set({ token: null, tokenExpiresAt: null })
      .where('tokenExpiresAt < :now', { now: new Date() })
      .execute();
  }
}
