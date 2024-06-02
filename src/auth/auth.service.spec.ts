import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'

describe('AuthService', () => {
  let service: AuthService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createToken', () => {
    it('should return a signed token', async () => {
      const id = 1
      const cpf = '911.188.233-11'
      const signSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue('mockToken')

      const result = await service.createToken(id, cpf)

      expect(signSpy).toHaveBeenCalledWith({ id, cpf })
      expect(result).toEqual('mockToken')
    })
  })

  describe('checkToken', () => {
    it('should return the verified token payload', async () => {
      const token = 'token mockToken'
      const verifySpy = jest
        .spyOn(jwtService, 'verify')
        .mockReturnValue({ id: 1, cpf: '911.188.233-11' })

      const result = await service.checkToken(token)

      expect(verifySpy).toHaveBeenCalledWith('mockToken')
      expect(result).toEqual({ id: 1, cpf: '911.188.233-11' })
    })

    it('should return false if the token is invalid', async () => {
      const token = 'invalidToken'
      const verifySpy = jest
        .spyOn(jwtService, 'verify')
        .mockImplementation(() => {
          throw new Error('Invalid token')
        })

      const result = await service.checkToken(token)

      expect(verifySpy).toHaveBeenCalledWith('invalidToken')
      expect(result).toEqual(false)
    })
  })

  describe('tokenCpf', () => {
    it('should return the CPF from the verified token payload', async () => {
      const token = 'token mockToken'
      const verifySpy = jest
        .spyOn(jwtService, 'verify')
        .mockReturnValue({ id: 1, cpf: '911.188.233-11' })

      const result = await service.tokenCpf(token)

      expect(verifySpy).toHaveBeenCalledWith('mockToken')
      expect(result).toEqual('911.188.233-11')
    })

    it('should return false if the token is invalid', async () => {
      const token = 'invalidToken'
      const verifySpy = jest
        .spyOn(jwtService, 'verify')
        .mockImplementation(() => {
          throw new Error('Invalid token')
        })

      const result = await service.tokenCpf(token)

      expect(verifySpy).toHaveBeenCalledWith('invalidToken')
      expect(result).toEqual(false)
    })
  })
})
