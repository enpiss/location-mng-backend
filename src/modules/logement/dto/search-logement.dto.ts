import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchLogementDto extends PageOptionsDto {
  @ApiProperty({
    description: 'Titre du logement',
    example: 'Appartement T2 au centre-ville',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiProperty({
    description: 'Adresse du logement',
    example: '123 Rue de la Paix, 75002 Paris',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly address?: string;

  @ApiProperty({
    description: 'Montant minimum du loyer',
    example: '500000',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly minRentAmount?: number;

  @ApiProperty({
    description: 'Montant maximum du loyer',
    example: '1500000',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly maxRentAmount?: number;

  @ApiProperty({
    description: "Jour minimum d'échéance du loyer",
    example: '1',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly minRentDueDay?: number;

  @ApiProperty({
    description: "Jour maximum d'échéance du loyer",
    example: '28',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly maxRentDueDay?: number;

  @ApiProperty({
    description: 'Le logement est-il archivé ou actif ?',
    example: true,
    required: false,
  })
  @IsOptional()
  readonly isActive?: boolean;
}
