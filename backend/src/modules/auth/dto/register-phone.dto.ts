import {
  IsString,
  MinLength,
  MaxLength,
  IsDateString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterPhoneDto {
  @ApiProperty({
    example: '2125550100',
    minLength: 7,
    maxLength: 15,
    description: 'Digits only, no spaces or dashes',
  })
  @IsString()
  @MinLength(7, { message: 'phone must be at least 7 digits' })
  @MaxLength(15, { message: 'phone must not exceed 15 digits' })
  @Matches(/^\d+$/, { message: 'phone must contain digits only' })
  phone: string;

  @ApiPropertyOptional({
    example: '+1',
    default: '+1',
    description: 'E.164 country code prefix, e.g. +1, +44, +91',
  })
  @IsString()
  @MinLength(2, { message: 'countryCode must be at least 2 characters (e.g. +1)' })
  @MaxLength(5, { message: 'countryCode must not exceed 5 characters' })
  @Matches(/^\+\d{1,4}$/, {
    message: 'countryCode must start with + followed by 1-4 digits',
  })
  @Transform(({ value }: { value: unknown }) =>
    value === undefined || value === null ? '+1' : value,
  )
  countryCode: string = '+1';

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
