import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address associated with the account',
  })
  @IsEmail({}, { message: 'email must be a valid email address' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email: string;
}

export class ConfirmPasswordResetDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Reset token received via email',
  })
  @IsString({ message: 'token must be a string' })
  token: string;

  @ApiProperty({
    example: 'NewSecurePass1',
    minLength: 8,
    description:
      'New password; must contain at least one uppercase letter and one number',
  })
  @IsString()
  @MinLength(8, { message: 'newPassword must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'newPassword must contain at least one uppercase letter and one number',
  })
  newPassword: string;
}
