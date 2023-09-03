import 'dotenv/config';

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import helmet from 'helmet';

import { envConfig } from './config/environment.config';
import { swaggerConfig } from './config/swagger.config';
import { AppModule } from './ioC/app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  swaggerConfig(app);

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableVersioning({ type: VersioningType.URI });
  app.use(helmet());
  app.use(compression());

  await app.listen(envConfig.port);
  logger.log(`App started in ${await app.getUrl()}`);
}
bootstrap();
