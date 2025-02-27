import { Body, Controller, Patch, Delete, Post, Get, UseGuards } from '@nestjs/common'
import { AdminService } from './admin.service'
import { CreateUserDto, UpdateUserDto } from './dto'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { User } from 'src/common/types'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('user')
  @UseGuards(JwtAuthGuard)
  getUserInformation(@GetUser() user: User) {
    return user
  }

  @Post('user')
  createUser(@Body() createuserDto: CreateUserDto) {
    return this.adminService.createUser(createuserDto)
  }

  @Patch('user')
  @UseGuards(JwtAuthGuard)
  updateUser(@GetUser('id') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(userId, updateUserDto)
  }

  @Delete('user')
  @UseGuards(JwtAuthGuard)
  deleteUser(@GetUser('id') userId: number) {
    return this.adminService.deleteUser(userId)
  }
}
