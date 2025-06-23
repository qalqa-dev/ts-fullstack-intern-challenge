import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) throw new UnauthorizedException();

    const user = await this.usersService.validateToken(auth);
    if (!user) throw new UnauthorizedException();

    req.user = user;
    return true;
  }
}
