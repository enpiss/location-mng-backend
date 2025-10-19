import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto';
import { Expose } from 'class-transformer';

@Expose()
export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  constructor({
    itemCount = 0,
    pageOptionsDto = {},
  }: {
    itemCount?: number;
    pageOptionsDto?: Partial<PageOptionsDto>;
  } = {}) {
    this.page = pageOptionsDto?.page || 1;
    this.limit = pageOptionsDto?.limit || 10;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(itemCount / (this.limit || 1));
  }
}
