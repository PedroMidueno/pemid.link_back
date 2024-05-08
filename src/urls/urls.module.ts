import { Module } from '@nestjs/common'

import { CommonModule } from '../common/common.module'
import { AuthModule } from '../auth/auth.module'
import { UrlsService } from './urls.service'
import { UrlsController } from './urls.controller'

@Module({
  controllers: [UrlsController],
  providers: [UrlsService],
  imports: [AuthModule, CommonModule]
})
export class UrlsModule {}
