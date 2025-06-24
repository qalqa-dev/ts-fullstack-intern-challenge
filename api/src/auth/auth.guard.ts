import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) return false;

    const user = await this.usersService.validateToken(token);
    if (!user) return false;

    request.user = user;
    return true;
  }

  private extractToken(request: any): string | null {
    return request.headers.authorization?.split(' ')[1] || null;
  }
}
