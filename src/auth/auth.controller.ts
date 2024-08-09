import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { User } from 'src/common/types'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
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
  async googleCallback(@Req() req: any, @Res() res: any) {
    const user = await this.authService.loginWithGoogle(req.user.email, req.user.firstName, req.user.lastName)
    const frontendUrl = this.configService.get<string>('FRONTEND_URL')
    const userString = JSON.stringify(user)
    res.send(/*html*/ `
      <!DOCTYPE html>
        <html>
          <script>
            window.opener.postMessage(${userString}, '${frontendUrl}')
            window.close()
          </script>
      </html>
    `)
  }

  // Route for test auth endpoints
  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  test(@GetUser() user: User) {
    return { user }
  }
}
