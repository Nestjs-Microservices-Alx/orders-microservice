import { HttpStatus, Injectable } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/shared/dtos';
import { PrismaService } from 'src/shared/services';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return this.prismaService.order.create({
      data: createOrderDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const [total, orders] = await Promise.all([
      this.prismaService.order.count(),
      this.prismaService.order.findMany({
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    const lastPage = Math.ceil(total / limit);
    const nextPage = page < lastPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      meta: {
        total,
        page,
        limit,
        lastPage,
        nextPage,
        prevPage: page > lastPage ? null : prevPage,
      },
      data: orders,
    };
  }

  async findOne(id: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id },
    });

    if (!order)
      throw new RpcException({
        message: `Order ${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });

    return order;
  }
}
