import { Module } from '@nestjs/common'

import { CommonModule } from '../common/common.module'
import { AuthModule } from '../auth/auth.module'
import { UrlsService } from './urls.service'
import { UrlsController } from './urls.controller'
import { CacheModule } from '@nestjs/cache-manager'

const ONE_DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000

@Module({
  controllers: [UrlsController],
  providers: [UrlsService],
  imports: [AuthModule, CommonModule, CacheModule.register({ ttl: ONE_DAY_IN_MILISECONDS })]
})
export class UrlsModule {}
