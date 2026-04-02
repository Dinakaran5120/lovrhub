import { IsInt, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  ageMin?: number;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  ageMax?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  maxDistanceKm?: number;

  @IsOptional()
  @IsBoolean()
  showAge?: boolean;

  @IsOptional()
  @IsBoolean()
  showDistance?: boolean;
}
