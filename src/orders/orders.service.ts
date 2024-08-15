import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { ClientProxy, RpcException } from '@nestjs/microservices';

import { firstValueFrom } from 'rxjs';
import { PRODUCTS_SERVICE } from 'src/config';
import { PrismaService } from 'src/shared/services';
import { OrderFilterDto, StatusDto } from './dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,

    // microservices: mismo name q se uso al registrar el microservicio en el module `ClientsModule`
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const products = await firstValueFrom(
        this.productsClient.send(
          { cmd: 'find_products_by_ids' },
          {
            ids: createOrderDto.items.map((item) => item.productId),
          },
        ),
      );

      return {
        service: 'orders-microservice',
        action: 'create',
        data: products,
      };
      // return this.prismaService.order.create({
      //   data: createOrderDto,
      // });
    } catch (error) {
      console.log(error);
      throw new RpcException({
        message: error?.message || 'Error creating order',
        status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll(orderFilterDto: OrderFilterDto) {
    const { page, limit, ...rest } = orderFilterDto;

    const [total, orders] = await Promise.all([
      this.prismaService.order.count(),
      this.prismaService.order.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: rest,
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

  async findAllByStatus(orderFilterDto: OrderFilterDto) {
    const { page, limit, status } = orderFilterDto;

    const [total, orders] = await Promise.all([
      this.prismaService.order.count({
        where: { status },
      }),
      this.prismaService.order.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: { status },
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

  async changeStatus(statusDto: StatusDto) {
    const { id, status } = statusDto;
    const order = await this.findOne(id);
    if (order.status === status) return order;

    return this.prismaService.order.update({
      where: { id },
      data: { status },
    });
  }
}
