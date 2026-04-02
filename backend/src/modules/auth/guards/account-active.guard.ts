import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Guard that ensures the authenticated user's account is in 'active' status.
 * Apply after JwtAuthGuard so that req.user is already populated.
 */
@Injectable()
export class AccountActiveGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();

    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Not authenticated');
    }

    if (user.status !== 'active') {
      throw new ForbiddenException(
        'This action requires an active account. Please verify your account first.',
      );
    }

    return true;
  }
}
