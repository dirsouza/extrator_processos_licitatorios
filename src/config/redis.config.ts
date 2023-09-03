import { BullRootModuleOptions } from '@nestjs/bull';

import { envConfig } from './environment.config';

export const redisConfig = (): BullRootModuleOptions => ({
  redis: {
    host: envConfig.redisHost,
    port: envConfig.redisPort,
  },
});
