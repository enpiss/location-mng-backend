import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import {
  ILocataireCreatedEvent,
  ILocataireUpdatedEvent,
  LocataireEventEnum,
} from '../types/locataire-event.type';

@Injectable()
export class LocataireEvent {
  private readonly logger = new Logger(LocataireEvent.name);
  constructor(private readonly eventEmitter: EventEmitter2) {}

  created(payload: ILocataireCreatedEvent) {
    this.logger.debug({
      message: 'Emitting locataire created event',
      locataireId: payload.locataire.id,
    });
    this.eventEmitter.emit(LocataireEventEnum.CREATED, payload);
  }

  updated(payload: ILocataireUpdatedEvent) {
    this.logger.debug({
      message: 'Emitting locataire updated event',
      locataireId: payload.locataire.id,
    });
    this.eventEmitter.emit(LocataireEventEnum.UPDATED, payload);
  }
}
