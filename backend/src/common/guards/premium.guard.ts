import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class PremiumGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('User not found on request');
    }

    if (user.tier === 'free') {
      throw new ForbiddenException(
        'Premium subscription required. Upgrade to Premium or Premium Plus to access this feature',
      );
    }

    return true;
  }
}
