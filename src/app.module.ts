import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { DatabaseModule } from './database/database.module'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth/auth.service'
import { PurchasesModule } from './purchases/purchases.module';
import { PurchasePerMonthModule } from './purchase-per-month/purchase-per-month.module';

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
    PurchasePerMonthModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
