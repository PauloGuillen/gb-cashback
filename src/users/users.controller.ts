import { Controller, Post, Body } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { OutputUserDto } from './dto/output-user.dto'
import { AuthService } from 'src/auth/auth.service'
import { ApiTags } from '@nestjs/swagger'

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('accounts')
  create(@Body() createUserDto: CreateUserDto): Promise<OutputUserDto> {
    return this.usersService.create(createUserDto)
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const id = await this.usersService.login(loginUserDto)
    const token = await this.authService.createToken(id, loginUserDto.cpf)
    return { auth: true, token: token }
  }
}
