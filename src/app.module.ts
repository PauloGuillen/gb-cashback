import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { DatabaseModule } from './database/database.module'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth/auth.service'
import { PurchasesModule } from './purchases/purchases.module'
import { PurchasesPerMonthModule } from './purchases-per-month/purchases-per-month.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: parseInt(process.env.EXPIRES),
      },
    }),
    UsersModule,
    DatabaseModule,
    PurchasesModule,
    PurchasesPerMonthModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
