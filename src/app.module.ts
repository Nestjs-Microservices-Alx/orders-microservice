import { Module } from '@nestjs/common';

import { OrdersModule } from './orders/orders.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [OrdersModule, SharedModule],
})
export class AppModule {}
