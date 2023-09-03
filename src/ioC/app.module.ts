import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

import { mongooseConfig } from '../config/mongoose.config';
import { rateLimitConfig } from '../config/rate-limit.config';
import { redisConfig } from '../config/redis.config';
import { BiddingProcessModule } from '../module/bidding-process/bidding-process.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: mongooseConfig,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: rateLimitConfig,
    }),
    BullModule.forRootAsync({
      useFactory: redisConfig,
    }),
    ScheduleModule.forRoot(),
    BiddingProcessModule,
  ],
})
export class AppModule {}
