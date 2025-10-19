import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class PageOptionsDto {
  @ApiProperty({
    description: 'Numéro de la page',
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  readonly page = 1;

  @ApiProperty({
    description: "Nombre d'éléments par page",
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
