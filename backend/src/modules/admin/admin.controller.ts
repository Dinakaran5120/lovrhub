import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { AdminService } from './admin.service';

type ReportDecision = 'dismiss' | 'warn' | 'suspend' | 'delete';

class SuspendUserDto {
  @IsString()
  @MaxLength(500)
  reason: string;
}

class DeleteUserDto {
  @IsString()
  @MaxLength(500)
  reason: string;
}

class ReviewReportDto {
  @IsEnum(['dismiss', 'warn', 'suspend', 'delete'])
  decision: ReportDecision;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  notes?: string;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getUsers(
      Math.max(1, page),
      Math.min(100, limit),
      search,
      status,
    );
  }

  @Get('users/:id')
  async getUserDetail(@Param('id', ParseUUIDPipe) userId: string) {
    return this.adminService.getUserDetail(userId);
  }

  @Patch('users/:id/suspend')
  @HttpCode(HttpStatus.OK)
  async suspendUser(
    @CurrentUser('id') adminId: string,
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() dto: SuspendUserDto,
  ) {
    return this.adminService.suspendUser(adminId, userId, dto.reason);
  }

  @Patch('users/:id/unsuspend')
  @HttpCode(HttpStatus.OK)
  async unsuspendUser(
    @CurrentUser('id') adminId: string,
    @Param('id', ParseUUIDPipe) userId: string,
  ) {
    return this.adminService.unsuspendUser(adminId, userId);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUserAdmin(
    @CurrentUser('id') adminId: string,
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() dto: DeleteUserDto,
  ) {
    return this.adminService.deleteUserAdmin(adminId, userId, dto.reason);
  }

  @Get('reports')
  async getPendingReports(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status', new DefaultValuePipe('pending')) status: string,
  ) {
    return this.adminService.getPendingReports(
      Math.max(1, page),
      Math.min(100, limit),
      status,
    );
  }

  @Patch('reports/:id/review')
  @HttpCode(HttpStatus.OK)
  async reviewReport(
    @CurrentUser('id') adminId: string,
    @Param('id', ParseUUIDPipe) reportId: string,
    @Body() dto: ReviewReportDto,
  ) {
    return this.adminService.reviewReport(
      adminId,
      reportId,
      dto.decision,
      dto.notes,
    );
  }

  @Get('audit-logs')
  async getAuditLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('userId') userId?: string,
  ) {
    return this.adminService.getAuditLogs(
      Math.max(1, page),
      Math.min(100, limit),
      userId,
    );
  }
}
