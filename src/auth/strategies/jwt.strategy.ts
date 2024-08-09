import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/common/prisma.service'
import { JwtPayload } from '../interfaces/JwtPayload.interface'
import { User } from 'src/common/types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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

    const user: User = await this.prisma.users.findFirst(
      {
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          deleted: true
        }
      }
    )

    if (!user) {
      throw new UnauthorizedException()
    }

    if (user.deleted) {
      throw new UnauthorizedException('User has been deleted')
    }

    delete user.deleted

    return user
  }
}
