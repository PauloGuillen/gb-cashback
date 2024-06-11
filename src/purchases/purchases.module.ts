import { Logger, Module } from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { PurchasesController } from './purchases.controller'
import { Purchase } from './entities/purchase.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PurchasesPerMonth } from './entities/purchases-per-month.entity'
import { JwtModule } from '@nestjs/jwt'
import { HttpModule } from '@nestjs/axios'
import { User } from '../users/entities/user.entity'
import { AuthService } from '../auth/auth.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, User, PurchasesPerMonth]),
    JwtModule.register({
      secret: process.env.SECRET || 'secret',
      signOptions: {
        expiresIn: parseInt(process.env.EXPIRES) || 3600,
      },
    }),
    HttpModule,
  ],
  controllers: [PurchasesController],
  providers: [Logger, PurchasesService, AuthService],
})
export class PurchasesModule {}
