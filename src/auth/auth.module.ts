import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { CommonModule } from 'src/common/common.module'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '3d'
      }
    }),
    CommonModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [PassportModule, JwtModule]
})
export class AuthModule {}
