import { Module } from '@nestjs/common';
import { LogementService } from './logement.service';
import { LogementController } from './logement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logement } from './entities/logement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Logement])],
  controllers: [LogementController],
  providers: [LogementService],
})
export class LogementModule {}
