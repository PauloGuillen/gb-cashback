import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthGuard } from '../auth/auth.guard'

describe('UsersController - Unit test', () => {
  let controller: UsersController

  const mockUsersService = {
    create: jest.fn(),
    login: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('create user', async () => {
    const userDto: CreateUserDto = {
      name: 'Isaac Newton',
      cpf: '478.183.944-11',
      email: 'isaac.newton@email.com',
      password: 'password secret',
    }
    await controller.create(userDto)

    expect(mockUsersService.create).toHaveBeenCalled()
    expect(mockUsersService.create).toHaveBeenCalledWith(userDto)
  })

  it('login', async () => {
    const userDto: LoginUserDto = {
      cpf: '478.183.944-11',
      password: 'password secret',
    }
    await controller.login(userDto)

    expect(mockUsersService.login).toHaveBeenCalled()
    expect(mockUsersService.login).toHaveBeenCalledWith(userDto)
  })
})
