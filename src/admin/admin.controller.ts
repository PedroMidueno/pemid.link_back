import { Body, Param, Controller, ParseIntPipe, Patch, Delete, Post, Get, UseGuards } from '@nestjs/common'

import { AdminService } from './admin.service'
import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { User } from 'src/common/types'

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Get('get-user-info')
  @UseGuards(AuthGuard('jwt'))
  getUserInformation(@GetUser() user: User) {
    return user
  }

  @Get('validate-pass/:pass')
  @UseGuards(AuthGuard('jwt'))
  validatePassword(@Param('pass') password: string, @GetUser('id') userId: number) {
    return this.adminService.validatePasswordToUpdate(password, userId)
  }

  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(@Body() updatePasswordDto: UpdatePasswordDto, @GetUser('id') userId: number) {
    return this.adminService.changeUserPassword(updatePasswordDto, userId)
  }

  @Post('create-user')
  createUser(@Body() createuserDto: CreateUserDto) {
    return this.adminService.createUser(createuserDto)
  }

  @Patch('update-user')
  @UseGuards(AuthGuard('jwt'))
  updateUser(@GetUser('id') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(userId, updateUserDto)
  }

  @Delete('delete-user')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@GetUser('id') userId: number) {
    return this.adminService.deleteUser(userId)
  }
}
