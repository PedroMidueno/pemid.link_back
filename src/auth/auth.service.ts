import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './interfaces/JwtPayload.interface'
import { AdminService } from 'src/admin/admin.service'

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService
  ) { }

  async loginWithSocialProvider (email: string, firstName: string, lastName: string) {
    const user = await this.adminService.getOrCreateUser(email, firstName, lastName)

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt
      },
      token: this.getJwtToken({ id: user.id })
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)

    return token
  }
}
