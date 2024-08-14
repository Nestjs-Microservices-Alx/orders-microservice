import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

import { PAGINATION } from '../utils';

export class PaginationDto {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = PAGINATION.page;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  limit?: number = PAGINATION.limit;
}
