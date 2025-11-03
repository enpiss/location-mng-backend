import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  type IPaiementCreatedEvent,
  PaiementEventEnum,
} from '../types/paiement-event.type';
import { EcheancesLoyerService } from '../../echeances-loyer/echeances-loyer.service';
import { AffectationPaiementService } from '../../echeances-loyer/affectation-paiement/affectation-paiement.service';

@Injectable()
export class PaiementCreatedListenerService {
  private logger = new Logger(PaiementCreatedListenerService.name);
  constructor(
    private readonly echeanceService: EcheancesLoyerService,
    private readonly affectationService: AffectationPaiementService,
  ) {}

  @OnEvent(PaiementEventEnum.created)
  async handlePaiementCreatedEvent(payload: IPaiementCreatedEvent) {
    this.logger.log({
      message: 'Paiement created event',
      payload,
    });

    const { paiement } = payload;

    // Appeler le service d'affectation pour gérer la répartition du paiement
    await this.affectationService.affecterPaiement(paiement);

    this.logger.log('Affectation du paiement terminée.');
  }
}
