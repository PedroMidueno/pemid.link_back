import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { CommonModule } from 'src/common/common.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { ConfigModule } from '@nestjs/config'
import { GoogleStrategy } from './strategies/google.strategy'
import { AdminService } from 'src/admin/admin.service'
import { GithubStrategy } from './strategies/github.strategy'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '3d'
      }
    }),
    CommonModule,
    HttpModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy, AdminService],
  exports: [PassportModule, JwtModule, JwtStrategy]
})
export class AuthModule {}
