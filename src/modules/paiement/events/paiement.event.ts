import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IPaiementCreatedEvent,
  PaiementEventEnum,
} from '../types/paiement-event.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaiementEvent {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  created(payload: IPaiementCreatedEvent) {
    this.eventEmitter.emit(PaiementEventEnum.created, payload);
  }
}
