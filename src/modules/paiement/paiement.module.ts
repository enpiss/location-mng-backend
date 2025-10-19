import { Module } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paiement } from './entities/paiement.entity';
import { LocataireModule } from '../locataire/locataire.module';

@Module({
  imports: [TypeOrmModule.forFeature([Paiement]), LocataireModule],
  controllers: [PaiementController],
  providers: [PaiementService],
})
export class PaiementModule {}
