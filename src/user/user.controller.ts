import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      success: true,
      user,
      message: 'User already exists'
    };

  }

  @Get()
  @Roles('admin')
  async findAll() {
    const users = await this.userService.findAll();
    return {
      success: true,
      users,
      message: 'Users fetched successfully'
    }

  }

  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userService.findOne(req.user.id);
    return {
      success: true,
      user,
      message: 'User fetched successfully'
    }
  }


  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return {
      success: true,
      user,
      message: 'User fetched successfully'
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    if (req.user.id !== +id && req.user.role !== 'admin') {
      return {
        success: false,
        message: 'You are not authorized to update this user'
      }
    }

    const user = await this.userService.update(+id, updateUserDto);
    return {
      success: true,
      user,
      message: 'User updated successfully'
    }
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return {
      success: true,
      message: 'User deleted successfully'
    }
  }
}
