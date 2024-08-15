import { IsNumber, IsPositive } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  // solo x el ejemplo :v
  @IsNumber()
  @IsPositive()
  price: number;
}
