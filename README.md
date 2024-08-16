<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="90" alt="Nest Logo" /></a>
</p>

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# envs: based on .env.example

# DB
pnpm exec prisma migrate dev
```

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

















<!-- ================================================= -->
# Microservices
- --- Iniciamos los microservicios 
  - -- Con la dep `pnpm add @nestjs/microservices`







- --- `DTO`
  - -- Para validarlo instalamos:  `pnpm add class-validator class-transformer`
    - Aplicamos las validaciones en el DTO
    - Registramos el `ValidationPipe()` en el  `main.ts`




- --- Configurar las `Environment Variables` -> `.env`   <--- Esta es la mas usada para REST, pero para `Microservices` complica un poco las cosas, asi q se usa otra forma
  - Para microservices por facilidad NO se usa el ConfigModule ni el `ConfigService` xq sino se tiene q cargar config serve async y cosas medias raras/complejas
  - ya NOOOOO Requiere algunas dependencies   `pnpm add @nestjs/config`

  - --- Enfoque en Microservices: Aqui uso joi por las risas :v, en el repo uso zod
    - -- Install:     `pnpm add dotenv joi`
    - -- Creamos el   `envs.ts`    en el  /config   <--  creamos el .env tb
    - -- En el   `main.ts`   lo usamos y ya, sin configs especiales





### Prisma
- --- Usaremos PrismaORM para poder interactuar con la DB
  - -- Instalamos prisma y setup
    - run
      ```sh
        pnpm add -D prisma
      ```

  - -- Iniciamos prisma
    - Inicializa prisma proplus :v
      ```sh
        pnpm exec prisma init
      ```

  - -- Corremos `MIGRACIONES`
    - run:
      ```sh
        pnpm exec prisma migrate dev --name init
      ```

  - -- Prisma Client
    - Este si no va en dev, este si se necesita:
      ```sh
        pnpm add @prisma/client
      ```

    - Seteamos este prima client en el Service q vaya a utilizarlo:
      - `service.ts`:
        - Se lo usa y configura con el OnModuleInit como el NgOnInit de angular:
          - PrismaClient, OnModuleInit
        ```ts
          @Injectable()
          export class PrismaService extends PrismaClient implements OnModuleInit {
            async onModuleInit() {
              await this.$connect();
            }
          }
        ```

      https://docs.nestjs.com/recipes/prisma#set-up-prisma


  - -- Crear nuevas migraciones:
    - run: `pnpm exec prisma migrate dev --name added_sku`  <- le damos el nombre q queremos





<!-- /* ================================================================ -->
### Documentar con OpenAPI
-- Documentacion - OpenAPI: https://docs.nestjs.com/openapi/introduction
  - Instalamos dependencias:    `pnpm add @nestjs/swagger`

  - OpenAPI es el Standar, Swagger es la implementacion
    - Configuramos en el      `main.ts`
      - Crea el cascaron vacio de la doc en  /api
```js
  // // docs    <---   main.ts
  const config = new DocumentBuilder()
    .setTitle('Teslo example')
    .setDescription('Tesloshop REST API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // endpoint  /api
```

  - Debemos empezar a definir como luce cada enpoint/dto para la doc
    - @ApiTags('Products'): Separar x tags  en el Controller
      -  @ApiResponse({ status: 201, description: 'Product was created' , type: Product})
    - @ApiProperty({})  en la Entity/DTO

  - -- Tengo mi propio decorador








