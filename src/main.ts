import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  // // envs
  const PORT = envs.PORT;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      // transport: Transport.TCP, // para el 1er ejemplo con el MessagePattern(emito y espero respuesta)
      transport: Transport.NATS,
      options: {
        servers: envs.NATS_SERVERS, // NATS
        // port: PORT, // TCP
      },
    },
  );

  // // logger ------------
  const logger = new Logger('MAIN');

  // // set global pipes ------------
  app.useGlobalPipes(
    // validate DTOs
    new ValidationPipe({
      whitelist: true, // remueve extra data of DTO - like Mongoose ODM
      // forbidNonWhitelisted: true, // envia 1 error con las properties q NO estan definidas en DTO
    }),
  );

  // microservice
  await app.listen();
  logger.log(`Orders Microservice is running on port ${PORT}`);
}
bootstrap();
