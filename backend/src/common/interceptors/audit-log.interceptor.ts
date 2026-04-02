import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtPayload } from '../decorators/current-user.decorator';

const AUDITED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;

    if (!AUDITED_METHODS.has(method.toUpperCase())) {
      return next.handle();
    }

    const user = request.user as JwtPayload | undefined;
    const userId = user?.sub ?? null;
    const action = `${method.toUpperCase()} ${url}`;
    const ipAddress = this.extractIp(request);

    return next.handle().pipe(
      tap({
        next: () => {
          // Fire-and-forget – do not await, do not block the response
          this.writeAuditLog({
            userId,
            action,
            ipAddress,
            statusCode: 'SUCCESS',
          }).catch(() => {
            // Silently swallow errors so audit failures never affect the API
          });
        },
        error: () => {
          // Also log failed mutating requests for forensic purposes
          this.writeAuditLog({
            userId,
            action,
            ipAddress,
            statusCode: 'ERROR',
          }).catch(() => {});
        },
      }),
    );
  }

  private async writeAuditLog(params: {
    userId: string | null;
    action: string;
    ipAddress: string | null;
    statusCode: string;
  }): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        ipAddress: params.ipAddress,
        statusCode: params.statusCode,
        createdAt: new Date(),
      },
    });
  }

  private extractIp(request: Request): string | null {
    // Respect X-Forwarded-For when behind a reverse proxy
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
      return first.trim();
    }
    return (
      (request.headers['x-real-ip'] as string | undefined) ??
      request.socket?.remoteAddress ??
      null
    );
  }
}
