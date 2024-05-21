import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesPerMonthService } from './purchases-per-month.service';

describe('PurchasesPerMonthService', () => {
  let service: PurchasesPerMonthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasesPerMonthService],
    }).compile();

    service = module.get<PurchasesPerMonthService>(PurchasesPerMonthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
