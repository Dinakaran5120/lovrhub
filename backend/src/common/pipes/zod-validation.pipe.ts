import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata): unknown {
    try {
      return this.schema.parse(value);
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: ValidationError[] = err.errors.map((issue) => ({
          field: issue.path.length > 0 ? issue.path.join('.') : 'root',
          message: issue.message,
        }));

        throw new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      }

      // Re-throw non-Zod errors unchanged
      throw err;
    }
  }
}
