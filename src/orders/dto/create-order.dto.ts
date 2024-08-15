import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // validate each item in the array with each dto
  @Type(() => OrderItemDto) // each item in the array is OrderItemDto
  items: OrderItemDto[];
}
