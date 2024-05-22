import { Module } from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { PurchasesController } from './purchases.controller'
import { Purchase } from './entities/purchase.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { PurchasesPerMonth } from './entities/purchases-per-month.entity'
import { AuthService } from 'src/auth/auth.service'
import { JwtModule } from '@nestjs/jwt'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, User, PurchasesPerMonth]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: parseInt(process.env.EXPIRES),
      },
    }),
    HttpModule,
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService, AuthService],
})
export class PurchasesModule {}
