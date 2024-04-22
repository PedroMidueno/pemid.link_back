import { Body, Param, Controller, ParseIntPipe, Patch, Delete, Post } from '@nestjs/common'

import { AdminService } from './admin.service'
import { CreateUserDto, UpdateUserDto } from './dto'

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
