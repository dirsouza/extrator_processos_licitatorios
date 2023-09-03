import { ThrottlerModuleOptions } from '@nestjs/throttler';

import { envConfig } from './environment.config';

export const rateLimitConfig = (): ThrottlerModuleOptions => ({
  limit: envConfig.rateLimit,
  ttl: envConfig.rateTll,
});
