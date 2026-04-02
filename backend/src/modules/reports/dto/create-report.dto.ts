import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ReportReason } from '@prisma/client';

export class CreateReportDto {
  @IsUUID()
  reportedUserId!: string;

  @IsEnum(ReportReason)
  reason!: ReportReason;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  reportedPostId?: string;
}
