import { Module } from '@nestjs/common';

import { SharedModule } from 'src/shared/shared.module';
import { NatsModule } from 'src/transports/nats.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  // registrar el Microservicio de productos
  imports: [SharedModule, NatsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
