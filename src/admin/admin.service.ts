import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { UpdateUserDto, CreateUserDto } from './dto'
import { PrismaService } from 'src/common/prisma.service'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) { }

  async getOrCreateUser(email: string, firstName: string, lastName: string) {
    let user: { id: number, firstName: string, lastName: string, email: string, createdAt?: Date, password?: string }

    user = await this.prisma.users.findUnique({
      where: { email }
    })

    if (!user) {
      user = await this.createUser({ email, firstName, lastName })
    }

    return user
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.users.create({
        data: {
          ...createUserDto
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      })
    } catch (error) {
      if (error?.code === 'P2002')
        throw new BadRequestException('there is already an account with this email', {
          cause: 'Ya existe una cuenta con este correo'
        })

      throw new InternalServerErrorException(error.message)
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    await this.prisma.users.update({
      where: { id },
      data: { ...updateUserDto, modifiedAt: new Date() }
    })
  }

  async deleteUser(id: number) {
    await this.prisma.users.update({
      where: { id },
      data: { deleted: true, deletedAt: new Date() }
    })
  }
}
