import { Test, TestingModule } from '@nestjs/testing';
import { EcheancesLoyerController } from './echeances-loyer.controller';
import { EcheancesLoyerService } from './echeances-loyer.service';

describe('EcheancesLoyerController', () => {
  let controller: EcheancesLoyerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EcheancesLoyerController],
      providers: [EcheancesLoyerService],
    }).compile();

    controller = module.get<EcheancesLoyerController>(EcheancesLoyerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
