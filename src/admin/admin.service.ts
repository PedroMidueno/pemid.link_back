import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UpdateUserDto, CreateUserDto, UpdatePasswordDto } from './dto'
import { PrismaService } from 'src/common/prisma.service'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) { }

  async validatePasswordToUpdate(password: string, userId: number) {
    const passwordInDb = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        password: true
      }
    })

    if (!passwordInDb.password) return { equals: true }

    const equals = bcrypt.compareSync(password, passwordInDb.password)

    return {
      equals
    }
  }

  async changeUserPassword(updatePasswordDto: UpdatePasswordDto, userId: number) {
    const { oldPassword, newPassword } = updatePasswordDto

    const user = await this.prisma.users.findUnique({ where: { id: userId } })

    if (user.password) {
      const equals = bcrypt.compareSync(oldPassword, user.password)

      if (!equals)
        throw new BadRequestException('given password does not match with current password', {
          cause: 'La contraseña no coincide con la actual'
        })
    }

    await this.prisma.users.update({
      where: {
        id: userId
      },
      data: {
        password: await bcrypt.hash(newPassword, 10)
      }
    })
  }

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
    const { password, ...userData } = createUserDto

    try {
      return await this.prisma.users.create({
        data: {
          ...userData,
          password: password ? await bcrypt.hash(password, 10) : undefined
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
