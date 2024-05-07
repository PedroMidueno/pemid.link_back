import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { User } from 'src/common/types'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  // Route for test auth endpoints
  @Get('test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    return { user }
  }
}
