import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ConfigService } from '@nestjs/config'
import { GoogleAuthGuard } from './guards/google-auth.guard'
import { GithubAuthGuard } from './guards/github-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) { }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  loginWithGoogle() { }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: any, @Res() res: any) {
    const user = await this.authService.loginWithSocialProvider(req.user.email, req.user.firstName, req.user.lastName)
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

  @Get('github')
  @UseGuards(GithubAuthGuard)
  async loginWithGithub() { }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(@Req() req: any, @Res() res: any) {
    const user = await this.authService.loginWithSocialProvider(req.user.email, req.user.firstName, req.user.lastName)
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
}
