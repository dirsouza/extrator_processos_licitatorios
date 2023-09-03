import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DITokens } from '../../config/container.config';
import { envConfig, EnvironmentConfig } from '../../config/environment.config';
import { BiddingController } from './adapter/controller/bidding.controller';
import { BiddingExtractionController } from './adapter/controller/bidding-extraction.controller';
import { BiddingMongoRepository } from './adapter/repository/bidding-mongo.repository';
import { ProcessingLogMongoRepository } from './adapter/repository/processing-log-mongo.repository';
import { Bidding, BiddingSchema } from './adapter/schema/bidding.schema';
import {
  ProcessingLog,
  ProcessingLogSchema,
} from './adapter/schema/processing-log.schema';
import { BiddingService } from './application/service/bidding.service';
import { BiddingExtractionService } from './application/service/bidding-extraction.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: ProcessingLog.name, schema: ProcessingLogSchema },
      { name: Bidding.name, schema: BiddingSchema },
    ]),
    BullModule.registerQueue({
      name: envConfig.queueName,
    }),
  ],
  controllers: [BiddingController, BiddingExtractionController],
  providers: [
    {
      provide: DITokens.ENVIRONMENT_CONFIG,
      useClass: EnvironmentConfig,
    },
    {
      provide: DITokens.BIDDING_SERVICE,
      useClass: BiddingService,
    },
    {
      provide: DITokens.PROCESSING_LOG_REPOSITORY,
      useClass: ProcessingLogMongoRepository,
    },
    {
      provide: DITokens.BIDDING_REPOSITORY,
      useClass: BiddingMongoRepository,
    },
    BiddingExtractionService,
  ],
})
export class BiddingProcessModule {}
