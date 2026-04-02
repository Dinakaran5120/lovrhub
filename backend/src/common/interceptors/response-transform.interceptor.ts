import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TransformedResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, TransformedResponse<T> | T>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<TransformedResponse<T> | T> {
    return next.handle().pipe(
      map((data) => {
        // Do not double-wrap responses that already carry a 'success' key
        // (e.g. error bodies forwarded through, or manually shaped responses)
        if (this.alreadyWrapped(data)) {
          return data;
        }

        return {
          success: true as const,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  private alreadyWrapped(data: unknown): data is T {
    return (
      data !== null &&
      typeof data === 'object' &&
      'success' in (data as object)
    );
  }
}
