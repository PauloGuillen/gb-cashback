import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesPerMonthController } from './purchases-per-month.controller';
import { PurchasesPerMonthService } from './purchases-per-month.service';

describe('PurchasesPerMonthController', () => {
  let controller: PurchasesPerMonthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasesPerMonthController],
      providers: [PurchasesPerMonthService],
    }).compile();

    controller = module.get<PurchasesPerMonthController>(PurchasesPerMonthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
