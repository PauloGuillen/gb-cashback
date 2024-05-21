import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchasesPerMonthService } from './purchases-per-month.service';
import { CreatePurchasesPerMonthDto } from './dto/create-purchases-per-month.dto';
import { UpdatePurchasesPerMonthDto } from './dto/update-purchases-per-month.dto';

@Controller('purchases-per-month')
export class PurchasesPerMonthController {
  constructor(private readonly purchasesPerMonthService: PurchasesPerMonthService) {}

  @Post()
  create(@Body() createPurchasesPerMonthDto: CreatePurchasesPerMonthDto) {
    return this.purchasesPerMonthService.create(createPurchasesPerMonthDto);
  }

  @Get()
  findAll() {
    return this.purchasesPerMonthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesPerMonthService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchasesPerMonthDto: UpdatePurchasesPerMonthDto) {
    return this.purchasesPerMonthService.update(+id, updatePurchasesPerMonthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasesPerMonthService.remove(+id);
  }
}
