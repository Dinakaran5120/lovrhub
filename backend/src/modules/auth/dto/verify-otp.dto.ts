import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the user whose OTP is being verified',
  })
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  userId: string;

  @ApiProperty({
    example: '482031',
    minLength: 6,
    maxLength: 6,
    description: '6-digit one-time password',
  })
  @IsString()
  @Length(6, 6, { message: 'otp must be exactly 6 characters' })
  otp: string;
}
