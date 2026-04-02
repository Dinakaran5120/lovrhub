import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { Logger } from 'pino';
import { Inject } from '@nestjs/common';

// Map Prisma error codes to HTTP statuses and messages
const PRISMA_ERROR_MAP: Record<
  string,
  { statusCode: number; message: string }
> = {
  P2002: {
    statusCode: HttpStatus.CONFLICT,
    message: 'A record with this value already exists (unique constraint violation)',
  },
  P2025: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'The requested record was not found',
  },
  P2003: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Operation failed due to a related record constraint (foreign key violation)',
  },
};

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly isProduction: boolean;

  constructor(@Inject('PINO_LOGGER') private readonly logger: Logger) {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request.url;

    // ── HttpException ────────────────────────────────────────────────────────
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message: string;
      let error: string | undefined;
      let extra: Record<string, unknown> = {};

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp['message'] as string) ?? exception.message;
        error = (resp['error'] as string) ?? exception.name;
        // Forward any extra keys (e.g. setupStep from SetupCompleteGuard)
        const { message: _m, error: _e, statusCode: _s, ...rest } = resp;
        extra = rest;
      } else {
        message = exception.message;
        error = exception.name;
      }

      this.logger.warn(
        { statusCode, path, method: request.method },
        `[HTTP ${statusCode}] ${message}`,
      );

      response.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error,
        ...extra,
        timestamp,
        path,
      });
      return;
    }

    // ── Prisma known request errors ──────────────────────────────────────────
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = PRISMA_ERROR_MAP[exception.code];

      if (mapped) {
        const { statusCode, message } = mapped;

        // For P2002 surface which fields caused the constraint violation
        let details: Record<string, unknown> | undefined;
        if (exception.code === 'P2002' && exception.meta?.target) {
          details = { fields: exception.meta.target };
        }

        this.logger.warn(
          { code: exception.code, path, method: request.method },
          `[Prisma ${exception.code}] ${message}`,
        );

        response.status(statusCode).json({
          success: false,
          statusCode,
          message,
          error: 'PrismaError',
          ...(details ?? {}),
          timestamp,
          path,
        });
        return;
      }

      // Unmapped Prisma error – treat as 500
      this.logInternalError(exception, request);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        this.buildInternalErrorBody(timestamp, path),
      );
      return;
    }

    // ── Prisma validation errors ─────────────────────────────────────────────
    if (exception instanceof Prisma.PrismaClientValidationError) {
      this.logger.warn(
        { path, method: request.method },
        '[Prisma ValidationError] Invalid query',
      );

      response.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid database query parameters',
        error: 'PrismaValidationError',
        timestamp,
        path,
      });
      return;
    }

    // ── ZodError ─────────────────────────────────────────────────────────────
    if (exception instanceof ZodError) {
      const validationErrors = exception.errors.map((issue) => ({
        field: issue.path.join('.') || 'root',
        message: issue.message,
      }));

      this.logger.warn(
        { path, method: request.method, errors: validationErrors },
        '[ZodError] Validation failed',
      );

      response.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: 'ValidationError',
        errors: validationErrors,
        timestamp,
        path,
      });
      return;
    }

    // ── Generic / unknown errors ─────────────────────────────────────────────
    this.logInternalError(exception, request);
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(this.buildInternalErrorBody(timestamp, path));
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private logInternalError(exception: unknown, request: Request): void {
    if (exception instanceof Error) {
      this.logger.error(
        {
          path: request.url,
          method: request.method,
          stack: this.isProduction ? undefined : exception.stack,
        },
        `[500] Unhandled exception: ${exception.message}`,
      );
    } else {
      this.logger.error(
        { path: request.url, method: request.method, exception },
        '[500] Unknown exception type thrown',
      );
    }
  }

  private buildInternalErrorBody(
    timestamp: string,
    path: string,
  ): Record<string, unknown> {
    return {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected internal server error occurred',
      error: 'InternalServerError',
      timestamp,
      path,
    };
  }
}
