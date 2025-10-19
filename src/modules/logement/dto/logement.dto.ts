import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class LogementDto extends AbstractDto {
  @ApiProperty({
    description: 'Le titre du logement',
    example: 'Appartement T2 Centre-Ville',
  })
  @IsString({
    message: 'Le titre doit être une chaîne de caractères',
  })
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiProperty({
    description: "L'adresse du logement",
    example: '123 Rue de la République, 75001 Paris',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  address: string;

  @ApiProperty({
    description: 'Description du logement',
    example: 'Bel appartement lumineux avec vue dégagée',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Montant du loyer mensuel',
    example: 750.5,
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  @Expose()
  @Type(() => Number)
  rentAmount: number;

  @ApiProperty({
    description: 'Jour du mois où le loyer est dû',
    example: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(31)
  @Expose()
  rentDueDay: number;

  @ApiProperty({
    description: 'ID du propriétaire du logement',
    example: 'uuid-du-proprietaire',
  })
  @IsUUID()
  @Expose()
  ownerId: string;

  @ApiProperty({
    description: "État d'activation du logement",
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive: boolean;
}
