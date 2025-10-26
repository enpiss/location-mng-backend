import { Test, TestingModule } from '@nestjs/testing';
import { EcheancesLoyerService } from './echeances-loyer.service';

describe('EcheancesLoyerService', () => {
  let service: EcheancesLoyerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EcheancesLoyerService],
    }).compile();

    service = module.get<EcheancesLoyerService>(EcheancesLoyerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
