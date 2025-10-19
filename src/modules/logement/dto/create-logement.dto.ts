import { PickType } from '@nestjs/mapped-types';
import { LogementDto } from './logement.dto';

export class CreateLogementDto extends PickType(LogementDto, [
  'title',
  'address',
  'description',
  'rentAmount',
  'rentDueDay',
  'ownerId',
  'isActive',
] as const) {}
