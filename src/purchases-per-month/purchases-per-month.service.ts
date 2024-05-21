import { Injectable } from '@nestjs/common';
import { CreatePurchasesPerMonthDto } from './dto/create-purchases-per-month.dto';
import { UpdatePurchasesPerMonthDto } from './dto/update-purchases-per-month.dto';

@Injectable()
export class PurchasesPerMonthService {
  create(createPurchasesPerMonthDto: CreatePurchasesPerMonthDto) {
    return 'This action adds a new purchasesPerMonth';
  }

  findAll() {
    return `This action returns all purchasesPerMonth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchasesPerMonth`;
  }

  update(id: number, updatePurchasesPerMonthDto: UpdatePurchasesPerMonthDto) {
    return `This action updates a #${id} purchasesPerMonth`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchasesPerMonth`;
  }
}
