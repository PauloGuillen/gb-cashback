import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { MockType } from '../utils/mocktype'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { repositoryMockFactory } from '../utils/repositorymockfactory'
import { User } from './entities/user.entity'
import {
  HttpException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from '../auth/auth.service'
import { JwtModule } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

describe('UsersService unit tests', () => {
  let service: UsersService
  let mockRepository: MockType<Repository<User>>
  const mockAuthService = {
    createToken: jest.fn(),
  }

  const userDto: CreateUserDto = {
    name: 'Isaac Newton',
    cpf: '478.183.944-11',
    email: 'isaac.newton@email.com',
    password: 'password secret',
  }
  const userMock = new User()
  userMock.id = 1
  userMock.name = userDto.name
  userMock.cpf = userDto.cpf
  userMock.email = userDto.email
  userMock.password = userDto.password

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'key secret',
          signOptions: {
            expiresIn: 1800,
          },
        }),
      ],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        Logger,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    mockRepository = module.get(getRepositoryToken(User))
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create user', () => {
    it('cpf duplicate', async () => {
      mockRepository.findOne.mockReturnValue(userDto)

      try {
        await service.create(userDto)
        throw new Error('Error')
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect(error.message).toBe('cpf duplicate')
      }

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1)

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: userDto.cpf },
      })
      expect(mockRepository.create).toHaveBeenCalledTimes(0)
      expect(mockRepository.save).toHaveBeenCalledTimes(0)
    })

    it('should create a user', async () => {
      mockRepository.findOne.mockReturnValue(null)
      mockRepository.create.mockReturnValue(userMock)
      mockRepository.save.mockReturnValue(userMock)
      await service.create(userDto)

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: userDto.cpf },
      })
      expect(mockRepository.create).toHaveBeenCalledTimes(1)
      expect(mockRepository.create).toHaveBeenCalledWith(userDto)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })
  })

  describe('login', () => {
    it('User not found', async () => {
      mockRepository.findOne.mockReturnValue(null)

      try {
        await service.login(userDto)
        throw new Error('Error')
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
        expect(error.message).toBe('User not found')
      }

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: userDto.cpf },
      })
    })
  })

  it('Password not valid', async () => {
    // const salt = await bcrypt.genSalt()
    // userMock.password = await bcrypt.hash(userDto.password, salt)
    userMock.password = 'password invalid'
    mockRepository.findOne.mockReturnValue(userMock)

    try {
      await service.login(userDto)
      throw new Error('Error')
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException)
      expect(error.message).toBe('Password not valid')
    }

    expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { cpf: userDto.cpf },
    })
  })

  it('Should create a token', async () => {
    const salt = await bcrypt.genSalt()
    userMock.password = await bcrypt.hash(userDto.password, salt)
    mockRepository.findOne.mockReturnValue(userMock)

    await service.login(userDto)

    expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { cpf: userDto.cpf },
    })
    expect(mockAuthService.createToken).toHaveBeenCalledTimes(1)
    expect(mockAuthService.createToken).toHaveBeenCalledWith(
      userMock.id,
      userMock.cpf,
    )
  })
})
