import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsDateString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterEmailDto {
  @ApiProperty({ example: 'user@example.com', maxLength: 255 })
  @IsEmail({}, { message: 'email must be a valid email address' })
  @MaxLength(255)
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email: string;

  @ApiProperty({
    example: 'SecurePass1',
    minLength: 8,
    maxLength: 100,
    description:
      'Must contain at least one uppercase letter, one number, and be at least 8 characters',
  })
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  @MaxLength(100, { message: 'password must not exceed 100 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'password must contain at least one uppercase letter and one number',
  })
  password: string;

  @ApiProperty({ example: 'Alex', minLength: 2, maxLength: 50 })
  @IsString()
  @MinLength(2, { message: 'displayName must be at least 2 characters long' })
  @MaxLength(50, { message: 'displayName must not exceed 50 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  displayName: string;

  @ApiProperty({
    example: '1995-06-15',
    description: 'ISO 8601 date string; user must be at least 18 years old',
  })
  @IsDateString({}, { message: 'birthDate must be a valid ISO 8601 date string' })
  birthDate: string;
}
