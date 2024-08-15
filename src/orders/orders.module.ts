import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PRODUCTS_SERVICE } from 'src/config';
import { SharedModule } from 'src/shared/shared.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  // registrar el Microservicio de productos
  imports: [
    SharedModule,
    ClientsModule.register([
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.TCP, // xq el microservicio usa TCP, siempre el mismo
        options: {
          host: envs.PRODUCTS_MICROSERVICE_HOST,
          port: envs.PRODUCTS_MICROSERVICE_PORT,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
