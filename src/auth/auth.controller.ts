import { Controller, Get, UseGuards, Req, Res, InternalServerErrorException, Query } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ConfigService } from '@nestjs/config'
import { GoogleAuthGuard } from './guards/google-auth.guard'
import { GithubAuthGuard } from './guards/github-auth.guard'
import { HttpService } from '@nestjs/axios'
import { catchError, firstValueFrom } from 'rxjs'
import { AxiosError } from 'axios'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
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

  @Get('grecaptcha/verify')
  async verifyCAPTCHAToken(@Query('response') response: string) {
    const secret = this.configService.get('G_RECAPTCHA_SECRET_KEY')

    const params = {
      secret,
      response
    }

    const { data } = await firstValueFrom(
      this.httpService.post('https://www.google.com/recaptcha/api/siteverify', null, { params }).pipe(
        catchError((error: AxiosError) => {
          throw new InternalServerErrorException(error.message, {
            cause: 'No se pudo verificar el reCAPTCHA'
          })
        })
      )
    )

    return {
      isValidCAPTCHAToken: data.success
    }
  }
}
