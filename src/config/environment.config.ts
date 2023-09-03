import { Injectable } from '@nestjs/common';
import { get } from 'env-var';

@Injectable()
export class EnvironmentConfig {
  // APP
  readonly host = get('HOST').default('localhost').asString();
  readonly port = get('PORT').default(3000).asPortNumber();

  // RATE LIMITING
  readonly rateLimit = get('RATE_LIMIT').default(10).asIntPositive();
  readonly rateTll = get('RATE_TTL').default(60).asIntPositive();

  // MONGODB
  readonly mongoDbUri = get('MONGO_DB_URI').required().asString();

  // REDIS
  readonly redisHost = get('REDIS_HOST').required().asString();
  readonly redisPort = get('REDIS_PORT').required().asPortNumber();

  // QUEUE
  readonly queueName = get('QUEUE_NAME').default('ExtractionQueue').asString();
  readonly queueJob = get('QUEUE_JOB').default('ExtractionJob').asString();
  readonly queueDelay = get('QUEUE_DELAY').default(60000).asIntPositive();

  // API do Portal de Compras Públicas
  readonly biddingProcessesUrl = get('BIDDING_PROCESSES_URL')
    .required()
    .asString();
}

export const envConfig = new EnvironmentConfig();
