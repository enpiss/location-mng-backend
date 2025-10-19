import { PickType } from '@nestjs/mapped-types';
import { PaiementDto } from './paiement.dto';

export class CreatePaiementDto extends PickType(PaiementDto, [
  'amount',
  'locataireId',
  'paidAt',
  'note',
]) {}
