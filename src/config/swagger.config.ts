import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { envConfig } from './environment.config';

export function swaggerConfig(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Extrator de Processos Licitatórios')
    .setVersion(process.env.npm_package_version)
    .setContact(
      'Diogo Souza',
      'https://www.linkedin.com/in/dirsouza/',
      'diogo.souza@msn.com',
    )
    .addServer(`http://${envConfig.host}:${envConfig.port}`)
    .addTag('Biddings')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);
}
