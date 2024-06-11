import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { OutputUserDto } from './dto/output-user.dto'
import { ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('accounts')
  create(@Body() createUserDto: CreateUserDto): Promise<OutputUserDto> {
    return this.usersService.create(createUserDto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.login(loginUserDto)
  }
}
