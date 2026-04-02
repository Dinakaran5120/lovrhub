import { IsNumber, IsInt, IsString, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { MoodType } from '@prisma/client';

export class DiscoverQueryDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  lng: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsEnum(MoodType)
  mood?: MoodType;
}
