import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [UsersModule],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
