import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

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
  page?: number = 1;

  @ApiProperty({
    description: "Nombre d'éléments par page",
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Ordre des résultats (ASC ou DESC)',
    example: 'ASC',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value as string).toUpperCase())
  order?: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({
    description: 'Ordonnement des résultats (champ)',
    example: 'createdAt',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  orderBy?: string = 'createdAt';

  get skip(): number {
    const page = this.page ?? 1;
    const limit = this.limit ?? 10;
    return (page - 1) * limit;
  }
}
