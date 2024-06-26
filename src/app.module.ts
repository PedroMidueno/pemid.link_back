import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from './common/common.module'
import { AdminModule } from './admin/admin.module'
import { UrlsModule } from './urls/urls.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CommonModule,
    AdminModule,
    UrlsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
