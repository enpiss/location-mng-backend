import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { EcheanceStatus } from '../entities/echeances-loyer.entity';
import { LocataireDto } from '../../locataire/dto/locataire.dto';

export class EcheanceLoyerDto extends AbstractDto {
  @ApiProperty({
    description: 'Identifiant du locataire associé à cette échéance',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @Expose()
  locataireId: string;

  locataire?: LocataireDto;

  @ApiProperty({
    description: "Clé représentant le mois et l'année (format YYYY-MM)",
    example: '2025-10',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  monthKey: string;

  @ApiProperty({
    description: 'Montant dû pour cette échéance',
    example: 750.55,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Type(() => Number)
  @Expose()
  amountDue: number = 0;

  @ApiProperty({
    description: 'Montant déjà payé pour cette échéance',
    example: 350.0,
    default: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @Expose()
  amountPaid: number;

  @ApiProperty({
    description: "Statut de paiement de l'échéance",
    enum: EcheanceStatus,
    example: EcheanceStatus.PARTIAL,
  })
  @IsEnum(EcheanceStatus)
  @Expose()
  status: EcheanceStatus;

  @ApiProperty({
    description: 'Solde restant à payer (calculé)',
    example: 400.0,
    readOnly: true,
  })
  @Expose()
  get balance(): number {
    return Number((this.amountDue ?? 0) - (this.amountPaid ?? 0));
  }
}
