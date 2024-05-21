import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchasesPerMonthDto } from './create-purchases-per-month.dto';

export class UpdatePurchasesPerMonthDto extends PartialType(CreatePurchasesPerMonthDto) {}
