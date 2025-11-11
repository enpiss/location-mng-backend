export enum LocataireEventEnum {
  CREATED = 'locataire.created',
  UPDATED = 'locataire.updated',
  DELETED = 'locataire.deleted',
}

export interface ILocataireCreatedEvent {
  locataire: {
    id: string;
    logement?: {
      id: string;
    };
  };
}

export interface ILocataireUpdatedEvent extends ILocataireCreatedEvent {
  previousLogementId?: string;
}
