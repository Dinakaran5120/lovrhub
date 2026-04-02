import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DiscoverController } from './discover.controller';
import { DiscoverService } from './discover.service';
import { MatchingService } from './matching.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    EventEmitterModule.forRoot({
      // Global event emitter configuration
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
  ],
  controllers: [DiscoverController],
  providers: [DiscoverService, MatchingService],
  exports: [MatchingService],
})
export class DiscoverModule {}
