import { PickType } from '@nestjs/mapped-types';
import { EcheanceLoyerDto } from './echeance-loyer.dto';

export class CreateEcheancesLoyerDto extends PickType(EcheanceLoyerDto, [
  'amountPaid',
  'amountDue',
  'locataireId',
  'monthKey',
]) {}
