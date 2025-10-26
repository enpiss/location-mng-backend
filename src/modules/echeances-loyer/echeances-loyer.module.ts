import { Module } from '@nestjs/common';
import { EcheancesLoyerService } from './echeances-loyer.service';
import { EcheancesLoyerController } from './echeances-loyer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcheanceLoyer } from './entities/echeances-loyer.entity';
import { AffectationPaiement } from './entities/affectation-paiement.entity';
import { Locataire } from '../locataire/entities/locataire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EcheanceLoyer, AffectationPaiement, Locataire])],
  controllers: [EcheancesLoyerController],
  providers: [EcheancesLoyerService],
})
export class EcheancesLoyerModule {}
