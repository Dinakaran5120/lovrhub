import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The refresh token UUID returned during login or previous refresh',
  })
  @IsString()
  @IsUUID('4', { message: 'refreshToken must be a valid UUID v4' })
  refreshToken: string;
}
