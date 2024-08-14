import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { OrderFilterDto, StatusDto } from './dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() orderFilterDto: OrderFilterDto) {
    return this.ordersService.findAll(orderFilterDto);
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  changeOrderStatus(@Payload() statusDto: StatusDto) {
    return this.ordersService.changeStatus(statusDto);
  }

  @MessagePattern('findAllOrdersByStatus')
  findAllByStatus(@Payload() orderFilterDto: OrderFilterDto) {
    return this.ordersService.findAllByStatus(orderFilterDto);
  }
}
