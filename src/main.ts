import { NestFactory } from '@nestjs/core';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  // // envs
  const PORT = envs.PORT;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP, // para el 1er ejemplo con el MessagePattern(emito y espero respuesta)
      options: {
        port: PORT,
      },
    },
  );

  // // logger ------------
  const logger = new Logger('MAIN');

  // microservice
  await app.listen();
  logger.log(`Orders Microservice is running on port ${PORT}`);
}
bootstrap();
