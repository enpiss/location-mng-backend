import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { LocataireDto } from '../../locataire/dto/locataire.dto';

export class PaiementDto extends AbstractDto {
  @ApiProperty({
    description: 'Montant du paiement',
    example: 25000.75,
  })
  @Type(() => Number)
  @IsNumber({
    maxDecimalPlaces:2,
  })
  @Min(1000, { message: 'Le montant minimum est de 1000 Fcfa' })
  @Expose()
  amount: number;

  @ApiProperty({
    description: 'Date du paiement',
    example: '2025-10-18',
  })
  @Type(() => Date)
  @IsDate()
  @Expose()
  paidAt: string;

  @ApiProperty({
    description: 'Clé du mois correspondant au paiement (format YYYY-MM)',
    example: '2025-10',
  })
  @IsString()
  @Length(7, 7)
  @Expose()
  monthKey: string;

  @ApiProperty({
    description: 'Note optionnelle concernant le paiement',
    example: 'Paiement en retard',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  note?: string;

  @ApiProperty({
    description: 'ID du locataire associé au paiement',
    example: 'uuid-du-locataire',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  locataireId: string;

  @ApiProperty({
    description: 'infos du locataire',
  })
  @Expose()
  locataire: LocataireDto;
}
