import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { User } from 'src/common/types'
import { AdminService } from 'src/admin/admin.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService
  ) { }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Get('google-login')
  @UseGuards(AuthGuard('google'))
  loginWithGoogle() { }

  @Get('google-callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: any) {
    return req.user
  }

  // Route for test auth endpoints
  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  test(@GetUser() user: User) {
    return { user }
  }
}
