import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { DatabaseModule } from './database/database.module'
import { JwtModule } from '@nestjs/jwt'
import { PurchasesModule } from './purchases/purchases.module'
import { AuthService } from './auth/auth.service'

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
  ],
  controllers: [],
  providers: [Logger, AuthService],
})
export class AppModule {}
