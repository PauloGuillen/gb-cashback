import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'

describe('UsersService unit tests', () => {
  let service: UsersService
  let id: number
  let expectOutputUsers: any
  let expectOutputUsers2: any
  let mockUsersRepository: any

  beforeEach(async () => {
    service = new UsersService()
    id = 1
    expectOutputUsers = {
      id,
      name: 'test',
      cpf: '999.999.999-00',
      email: 'user@email.com',
      password: 'password secret',
    }

    expectOutputUsers2 = {
      id: 2,
      name: 'test',
      cpf: '123.999.999-00',
      email: 'user@email.com',
      password: 'password secret',
    }

    mockUsersRepository = {
      create: jest.fn().mockReturnValue(Promise.resolve(expectOutputUsers)),
      save: jest.fn().mockReturnValue(Promise.resolve(expectOutputUsers)),
      findOne: jest.fn().mockReturnValue(Promise.resolve(expectOutputUsers)),
    }
  })

  it('should create a user', async () => {
    service['usersRepository'] = mockUsersRepository

    const createUserDto: CreateUserDto = {
      name: 'test',
      cpf: '123.999.999-00',
      email: 'user@email.com',
      password: 'password secret',
    }

    const newUser = await service.create(createUserDto)

    expect(mockUsersRepository.save).toHaveBeenCalled()
    expect(expectOutputUsers).toStrictEqual(newUser)
  })
})
