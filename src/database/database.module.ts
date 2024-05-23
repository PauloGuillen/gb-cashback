import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Purchase } from 'src/purchases/entities/purchase.entity'
import { PurchasesPerMonth } from 'src/purchases/entities/purchases-per-month.entity'
import { User } from 'src/users/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: Number(configService.get('DB_PORT')),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASS'),
          database: configService.get('DB_NAME'),

          // host: 'localhost',
          // port: 5432,
          // username: 'postgres',
          // password: 'secret',
          // database: 'gb-cashback',

          entities: [User, Purchase, PurchasesPerMonth],
          synchronize: true,
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
