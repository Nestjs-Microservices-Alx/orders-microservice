import { Module } from '@nestjs/common';

import { OrdersModule } from './orders/orders.module';
import { SharedModule } from './shared/shared.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [OrdersModule, SharedModule, NatsModule],
})
export class AppModule {}
