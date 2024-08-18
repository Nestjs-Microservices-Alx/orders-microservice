import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { OrderFilterDto, PaidOrderDto, StatusDto } from './dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  async create(@Payload() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    const paymentSession = await this.ordersService.createPaymentSession(
      order as any,
    );

    return {
      order,
      paymentSession,
    };
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

  // // EventPattern: no return required/wanted
  @EventPattern('payment.succeeded')
  paidOrder(@Payload() paidOrderDto: PaidOrderDto) {
    this.ordersService.markOrderAsPaid(paidOrderDto);
  }
}
