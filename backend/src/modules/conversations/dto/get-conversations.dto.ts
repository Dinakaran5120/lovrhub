import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class GetConversationsDto {
  @IsEnum(['all', 'unread'])
  @IsOptional()
  filter: 'all' | 'unread' = 'all';

  @IsString()
  @IsOptional()
  @MaxLength(100)
  search?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit: number = 20;

  @IsString()
  @IsOptional()
  cursor?: string;
}
