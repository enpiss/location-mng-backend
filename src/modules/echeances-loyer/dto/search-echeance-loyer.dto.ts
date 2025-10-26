import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { EcheanceStatus } from '../entities/echeances-loyer.entity';

export class SearchEcheanceLoyerDto extends PageOptionsDto {
  @ApiProperty({
    description: "Montant minimum dû pour l'échéance",
    example: 100.0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsDecimal()
  readonly minAmountDue?: number;

  @ApiProperty({
    description: "Montant maximum dû pour l'échéance",
    example: 1000.0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsDecimal()
  readonly maxAmountDue?: number;

  @ApiProperty({
    description: "Montant minimum payé pour l'échéance",
    example: 50.0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsDecimal()
  readonly minAmountPaid?: number;

  @ApiProperty({
    description: "Montant maximum payé pour l'échéance",
    example: 500.0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsDecimal()
  readonly maxAmountPaid?: number;

  @ApiProperty({
    description: "Clé du mois correspondant à l'échéance (format YYYY-MM)",
    example: '2025-10',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(7, 7)
  readonly monthKey?: string;

  @ApiProperty({
    description: "ID du locataire associé à l'échéance",
    example: 'uuid-du-locataire',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly locataireId?: string;

  @ApiProperty({
    description: "Statut de l'échéance (DUE, PARTIAL, PAID)",
    example: 'DUE',
    enum: EcheanceStatus,
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly status?: EcheanceStatus[];
}
