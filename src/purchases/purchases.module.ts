import { Module } from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { PurchasesController } from './purchases.controller'
import { Purchase } from './entities/purchase.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { PurchasesPerMonth } from './entities/purchases-per-month.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, User, PurchasesPerMonth])],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
