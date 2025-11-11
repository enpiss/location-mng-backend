import { Injectable, Logger } from '@nestjs/common';
import { EcheancesLoyerService } from '../../echeances-loyer/echeances-loyer.service';
import { OnEvent } from '@nestjs/event-emitter';
import {
  type ILocataireCreatedEvent,
  type ILocataireUpdatedEvent,
  LocataireEventEnum,
} from '../types/locataire-event.type';

@Injectable()
export class LocataireListenerService {
  private logger = new Logger(LocataireListenerService.name);
  constructor(private readonly echeanceService: EcheancesLoyerService) {}

  @OnEvent(LocataireEventEnum.CREATED)
  handleLocataireCreatedEvent(payload: ILocataireCreatedEvent) {
    const { locataire } = payload;
    this.logger.log({
      message: 'Locataire created listener',
      locataire: locataire.id,
    });

    // Initialiser les échéances de loyer pour le locataire
    void this.echeanceService.initialiserEcheancesPourLocataire(locataire.id);
  }

  @OnEvent(LocataireEventEnum.UPDATED)
  handleLocataireUpdatedEvent(payload: ILocataireUpdatedEvent) {
    const { locataire, previousLogementId } = payload;
    this.logger.log({
      message: 'Locataire updated listener',
      locataire: locataire.id,
    });
    if (locataire.logement?.id && locataire.logement.id != previousLogementId) {
      // Le logement a changé, réinitialisé les échéances de loyer
      void this.echeanceService.initialiserEcheancesPourLocataire(locataire.id);
    }
  }

  @OnEvent(LocataireEventEnum.DELETED)
  handleLocataireDeletedEvent(payload: ILocataireCreatedEvent) {
    const { locataire } = payload;
    this.logger.log({
      message: 'Locataire deleted event',
      locataire: locataire.id,
    });
  }
}
