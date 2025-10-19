import { Module } from '@nestjs/common';
import { LocataireService } from './locataire.service';
import { LocataireController } from './locataire.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locataire } from './entities/locataire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Locataire])],
  controllers: [LocataireController],
  providers: [LocataireService],
  exports: [LocataireService],
})
export class LocataireModule {}
