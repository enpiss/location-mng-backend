import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AffectationPaiement } from '../entities/affectation-paiement.entity';
import { Repository } from 'typeorm';
import { EcheancesLoyerService } from '../echeances-loyer.service';
import { Paiement } from '../../paiement/entities/paiement.entity';
import { SearchEcheanceLoyerDto } from '../dto/search-echeance-loyer.dto';
import { EcheanceStatus } from '../entities/echeances-loyer.entity';

@Injectable()
export class AffectationPaiementService {
  private readonly logger = new Logger(AffectationPaiementService.name);

  constructor(
    @InjectRepository(AffectationPaiement)
    private readonly affectationRepository: Repository<AffectationPaiement>,
    private readonly echeanceService: EcheancesLoyerService,
  ) {}

  async affecterPaiement(paiement: Paiement) {
    const { amount, locataire } = paiement;

    const searchDto = new SearchEcheanceLoyerDto();
    searchDto.locataireId = locataire.id;
    searchDto.limit = 100;
    searchDto.status = [EcheanceStatus.DUE, EcheanceStatus.PARTIAL];
    searchDto.order = 'ASC';

    // Récupérer les échéances dues ou partiellement payées
    const echeances = await this.echeanceService.findAll(searchDto);

    let remainingAmount = Number(amount);

    for (const echeance of echeances) {
      if (remainingAmount <= 0) break;

      const amountDue =
        Number(echeance.amountDue) - Number(echeance.amountPaid);

      const affectationAmount = Math.min(remainingAmount, amountDue);

      // Créer une nouvelle affectation
      const affectation = this.affectationRepository.create({
        echeanceLoyer: echeance,
        paiement: paiement,
        amount: affectationAmount,
      });

      await this.affectationRepository.save(affectation);

      // Mettre à jour l'échéance
      await this.echeanceService.update(echeance.id, {
        amountPaid: Number(echeance.amountPaid) + affectationAmount,
        status:
          affectationAmount === amountDue
            ? EcheanceStatus.PAID
            : EcheanceStatus.PARTIAL,
      });

      remainingAmount -= affectationAmount;
      this.logger.log({
        message: 'Affectation réalisée',
        echeanceId: echeance.id,
        montantAffecte: affectationAmount,
        montantRestant: remainingAmount,
      });
    }

    if (remainingAmount > 0) {
      this.logger.warn(
        `Montant restant après affectation : ${remainingAmount}. Vérifiez les échéances.`,
      );
    }
  }
}
