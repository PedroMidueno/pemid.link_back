import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { User } from 'src/common/types'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
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
  /* eslint-disable-next-line */
  async googleCallback(@Req() req: any) {
    const user = await this.authService.loginWithGoogle(req.user.email, req.user.firstName, req.user.lastName)

    return user
  }

  // Route for test auth endpoints
  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  test(@GetUser() user: User) {
    return { user }
  }
}
