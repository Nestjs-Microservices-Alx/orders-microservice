import { OrderStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { OrderStatusList } from '../enum';

export class StatusDto {
  @IsEnum(OrderStatusList, {
    message: `status must be a valid value (${OrderStatusList.join(', ')})`,
  })
  @IsOptional()
  status: OrderStatus;

  @IsUUID()
  id: string;
}
