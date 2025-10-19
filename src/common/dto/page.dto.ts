import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page-meta.dto';
import { PageOptionsDto } from './page-options.dto';

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }

  static fromEntities<T>(
    entities: T[],
    itemCount: number,
    pageOptionsDto: PageOptionsDto,
  ): PageDto<T> {
    const meta = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, meta);
  }
}
