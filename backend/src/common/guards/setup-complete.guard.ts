import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class SetupCompleteGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user?.sub) {
      throw new ForbiddenException('User not found on request');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: {
        setupCompleted: true,
        setupStep: true,
      },
    });

    if (!dbUser) {
      throw new ForbiddenException('User record not found');
    }

    if (!dbUser.setupCompleted) {
      throw new ForbiddenException({
        message: 'Profile setup not complete',
        setupStep: dbUser.setupStep ?? 1,
      });
    }

    return true;
  }
}
