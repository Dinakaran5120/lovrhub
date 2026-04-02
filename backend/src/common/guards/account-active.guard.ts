import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class AccountActiveGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('User not found on request');
    }

    if (user.status === 'suspended') {
      throw new ForbiddenException(
        'Account is suspended. Please contact support to resolve this issue',
      );
    }

    if (user.status !== 'active') {
      throw new ForbiddenException(
        `Account is not active. Current status: ${user.status}`,
      );
    }

    return true;
  }
}
