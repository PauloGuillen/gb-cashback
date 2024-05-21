import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createToken(id: number, cpf: string) {
    return this.jwtService.sign({ id, cpf })
  }

  async checkToken(token: string) {
    try {
      console.log('token: ', token)
      const verify = this.jwtService.verify(token.replace('Bearer ', ''))
      console.log('verify: ', verify)
      return verify
    } catch (err) {
      return false
    }
  }
}
