import { PartialType } from '@nestjs/swagger';
import { CreateEcheancesLoyerDto } from './create-echeances-loyer.dto';
import { EcheanceStatus } from '../entities/echeances-loyer.entity';

export class UpdateEcheancesLoyerDto extends PartialType(
  CreateEcheancesLoyerDto,
) {
  status?: EcheanceStatus;
}
