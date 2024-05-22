import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { LoginUserDto } from './dto/login-user.dto'
import { OutputUserDto } from './dto/output-user.dto'

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private usersRepository: Repository<User>

  async create(createUserDto: CreateUserDto): Promise<OutputUserDto> {
    let user = await this.usersRepository.findOne({
      where: { cpf: createUserDto.cpf },
    })
    if (user && user.cpf === createUserDto.cpf) {
      throw new NotAcceptableException('cpf duplicate')
    }
    user = this.usersRepository.create(createUserDto)
    user = await this.usersRepository.save(createUserDto)
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
    }
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

    return user.id
  }
}
