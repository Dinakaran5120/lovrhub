import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();

    const token = this.extractToken(client);

    if (!token) {
      client.emit('error', { message: 'Authentication token not provided' });
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      // Attach decoded payload to socket data so handlers can access it
      client.data.user = payload;
      return true;
    } catch (err: any) {
      const message =
        err?.name === 'TokenExpiredError'
          ? 'Authentication token has expired'
          : 'Authentication token is invalid';

      client.emit('error', { message });
      return false;
    }
  }

  private extractToken(client: Socket): string | null {
    // Prefer explicit auth token in handshake.auth
    const authToken = client.handshake?.auth?.token as string | undefined;
    if (authToken && authToken.trim().length > 0) {
      return authToken.trim();
    }

    // Fall back to Authorization header (Bearer scheme)
    const authHeader = client.handshake?.headers?.authorization as
      | string
      | undefined;
    if (authHeader) {
      const parts = authHeader.trim().split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        return parts[1];
      }
    }

    return null;
  }
}
