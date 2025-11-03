import { Paiement } from '../entities/paiement.entity';

export enum PaiementEventEnum {
  created = 'paiement.created',
  PAIEMENT_UPDATED = 'paiement.updated',
  PAIEMENT_DELETED = 'paiement.deleted',
}

export interface IPaiementCreatedEvent {
  paiement: Paiement;
}
