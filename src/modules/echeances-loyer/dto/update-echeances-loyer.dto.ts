import { PartialType } from '@nestjs/swagger';
import { CreateEcheancesLoyerDto } from './create-echeances-loyer.dto';

export class UpdateEcheancesLoyerDto extends PartialType(
  CreateEcheancesLoyerDto,
) {}
