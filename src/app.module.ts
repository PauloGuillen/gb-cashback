import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
