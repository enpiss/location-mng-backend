import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDecimal,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPaiementDto extends PageOptionsDto {
  @ApiProperty({
    description: 'Montant minimum du paiement',
    example: 100.0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsDecimal()
  readonly minAmount?: number;

  @ApiProperty({
    description: 'Montant maximum du paiement',
    example: 1000.0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsDecimal()
  readonly maxAmount?: number;

  @ApiProperty({
    description: 'Date minimum du paiement',
    example: '2025-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly minPaidAt?: string;

  @ApiProperty({
    description: 'Date maximum du paiement',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly maxPaidAt?: string;

  @ApiProperty({
    description: 'Clé du mois correspondant au paiement (format YYYY-MM)',
    example: '2025-10',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(7, 7)
  readonly monthKey?: string;

  @ApiProperty({
    description: 'ID du locataire associé au paiement',
    example: 'uuid-du-locataire',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly locataireId?: string;
}
