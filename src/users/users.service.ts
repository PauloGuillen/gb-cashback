import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthService } from 'src/auth/auth.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto)
    return await this.usersRepository.save(createUserDto)
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersRepository.findOne({
      where: { cpf: loginUserDto.cpf },
    })
    if (!user) {
      throw new NotFoundException('User not found.')
    }
    if (loginUserDto.password !== user.password) {
      throw new UnauthorizedException('Password not valid')
    }

    const token = await this.authService.createToken(user.id, user.cpf)
    const checkToken = await this.authService.checkToken(token)
    console.log('token id: ', checkToken.id)
    console.log('token cpf: ', checkToken.cpf)
    return token
  }
}
