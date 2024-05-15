import { Body, Param, Controller, ParseIntPipe, Patch, Delete, Post, Get, UseGuards } from '@nestjs/common'

import { AdminService } from './admin.service'
import { CreateUserDto, UpdateUserDto } from './dto'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { User } from 'src/common/types'

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Get('get-user-info')
  @UseGuards(AuthGuard())
  getUserInformation(@GetUser() user: User) {
    return user
  }

  @Post('create-user')
  createUser(@Body() createuserDto: CreateUserDto) {
    this.adminService.createUser(createuserDto)
  }

  @Patch('update-user/:id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    this.adminService.updateUser(id, updateUserDto)
  }

  @Delete('delete-user/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    this.adminService.deleteUser(id)
  }
}
