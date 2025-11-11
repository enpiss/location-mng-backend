import { Module } from '@nestjs/common';
import { LocataireService } from './locataire.service';
import { LocataireController } from './locataire.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locataire } from './entities/locataire.entity';
import { LocataireEvent } from './events/locataire.event';
import { LocataireListenerService } from './listeners/locataire.listener.service';
import { EcheancesLoyerModule } from '../echeances-loyer/echeances-loyer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Locataire]), EcheancesLoyerModule],
  controllers: [LocataireController],
  providers: [LocataireService, LocataireEvent, LocataireListenerService],
  exports: [LocataireService],
})
export class LocataireModule {}
