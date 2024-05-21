import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Purchase } from 'src/purchases/entities/purchase.entity'
import { User } from 'src/users/entities/user.entity'
import { DataSourceOptions } from 'typeorm'

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'secret',
  database: 'gb-cashback',
  entities: [User, Purchase],
  synchronize: true,
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          ...dataSourceOptions,
        }
      },
    }),
  ],
})
export class DatabaseModule {}
