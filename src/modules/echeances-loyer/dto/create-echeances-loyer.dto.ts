import { PickType } from '@nestjs/mapped-types';
import { EcheanceLoyerDto } from './echeance-loyer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateEcheancesLoyerDto extends PickType(EcheanceLoyerDto, [
  'amountPaid',
  'amountDue',
  'monthKey',
]) {
  @ApiProperty({
    description: 'Identifiant du locataire associé à cette échéance',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @Expose()
  locataireId: string;
}
