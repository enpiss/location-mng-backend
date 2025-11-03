import { Module } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paiement } from './entities/paiement.entity';
import { LocataireModule } from '../locataire/locataire.module';
import { EcheancesLoyerModule } from '../echeances-loyer/echeances-loyer.module';
import { PaiementCreatedListenerService } from './listeners/paiement-created.service';
import { PaiementEvent } from './events/paiement.event';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paiement]),
    LocataireModule,
    EcheancesLoyerModule,
  ],
  controllers: [PaiementController],
  providers: [PaiementService, PaiementCreatedListenerService, PaiementEvent],
})
export class PaiementModule {}
