import { Test, TestingModule } from '@nestjs/testing';
import { AffectationPaiementService } from './affectation-paiement.service';

describe('AffectationPaiementService', () => {
  let service: AffectationPaiementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffectationPaiementService],
    }).compile();

    service = module.get<AffectationPaiementService>(
      AffectationPaiementService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
