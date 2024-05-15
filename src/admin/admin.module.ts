import { Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { CommonModule } from 'src/common/common.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [CommonModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
