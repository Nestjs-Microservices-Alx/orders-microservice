import { OrderStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

import { OrderStatusList } from '../enum';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsNumber()
  @IsPositive()
  totalItems: number;

  @IsEnum(OrderStatusList, {
    message: `status must be one of the following values: ${OrderStatusList.join(
      ', ',
    )}`,
  })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;

  // todas deberian iniciar en false, pero x el ej se hace asi
  @IsBoolean()
  @IsOptional()
  paid: boolean = false;
}
