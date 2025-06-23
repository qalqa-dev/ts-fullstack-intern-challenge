import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Like } from './like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), UsersModule],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
