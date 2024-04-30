import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { PrismaService } from 'src/common/prisma.service'
import { JwtPayload } from '../interfaces/JwtPayload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate(payload: JwtPayload) {
    const { id } = payload

    const user = await this.prisma.users.findFirst({ where: { id } })

    if (!user) {
      throw new UnauthorizedException()
    }

    if (user.deleted) {
      throw new UnauthorizedException('User has been deleted')
    }

    return user
  }
}
