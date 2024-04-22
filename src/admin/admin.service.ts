import { Injectable } from '@nestjs/common'

import * as bcrypt from 'bcrypt'

import { UpdateUserDto, CreateUserDto } from './dto'
import { PrismaService } from 'src/common/prisma.service'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto

    await this.prisma.users.create({
      data: {
        ...userData,
        password: await bcrypt.hash(password, 10)
      }
    })
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
