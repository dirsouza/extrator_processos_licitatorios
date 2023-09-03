import { MongooseModuleOptions } from '@nestjs/mongoose';

import { envConfig } from './environment.config';

export const mongooseConfig = (): MongooseModuleOptions => ({
  uri: envConfig.mongoDbUri,
});
