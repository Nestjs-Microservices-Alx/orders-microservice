import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { PrismaService } from 'src/shared/services';
import { OrderFilterDto, StatusDto } from './dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,

    // microservices: mismo name q se uso al registrar el microservicio en el module `ClientsModule`
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      // validate products
      const products = await firstValueFrom(
        this.client.send(
          { cmd: 'find_products_by_ids' },
          {
            ids: createOrderDto.items.map((item) => item.productId),
          },
        ),
      );

      // calculate total
      const totalAmount = products.reduce((acc, product) => {
        const item = createOrderDto.items.find(
          (item) => item.productId === product.id,
        );

        return acc + item.quantity * product.price;
      }, 0);
      const totalItems = createOrderDto.items.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );

      // perist in db
      const order = await this.prismaService.order.create({
        data: {
          totalAmount,
          totalItems,

          // map items
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                quantity: orderItem.quantity,
                productId: orderItem.productId,
                price: products.find(
                  (product) => product.id === orderItem.productId,
                ).price,
              })),
            },
          },
        },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });

      return {
        ...order,
        OrderItem: order.OrderItem.map((item) => ({
          ...item,
          name: products.find((product) => product.id === item.productId).name,
        })),
      };
    } catch (error) {
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
      include: {
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true,
          },
        },
      },
    });
    if (!order)
      throw new RpcException({
        message: `Order ${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });

    try {
      // get products
      const products = await firstValueFrom(
        this.client.send(
          { cmd: 'find_products_by_ids' },
          {
            ids: order.OrderItem.map((item) => item.productId),
          },
        ),
      );

      return {
        ...order,
        OrderItem: order.OrderItem.map((item) => ({
          ...item,
          name: products.find((product) => product.id === item.productId).name,
        })),
      };
    } catch (error) {
      throw new RpcException({
        message: error?.message || 'Error finding order',
        status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
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
