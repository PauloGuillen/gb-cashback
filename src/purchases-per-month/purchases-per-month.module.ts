import { Module } from '@nestjs/common'
import { PurchasesPerMonthService } from './purchases-per-month.service'
import { PurchasesPerMonthController } from './purchases-per-month.controller'
import { PurchasesPerMonth } from './entities/purchases-per-month.entity'
import { User } from 'src/users/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([PurchasesPerMonth, User])],
  controllers: [PurchasesPerMonthController],
  providers: [PurchasesPerMonthService],
})
export class PurchasesPerMonthModule {}
