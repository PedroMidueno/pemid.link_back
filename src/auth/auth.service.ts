import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { PrismaService } from 'src/common/prisma.service'
import { JwtPayload } from './interfaces/JwtPayload.interface'
import { AdminService } from 'src/admin/admin.service'

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService
  ) { }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.prisma.users.findFirst({
      where: { email, deleted: false },
      select: {
        id: true,
        email: true,
        password: true
      }
    })

    if (!user) throw new NotFoundException('User not found')

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials')

    return {
      email: user.email,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async loginWithGoogle (email: string, firstName: string, lastName: string) {
    const user = await this.adminService.getOrCreateUser(email, firstName, lastName)

    return {
      email,
      token: this.getJwtToken({ id: user.id })
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)

    return token
  }
}
