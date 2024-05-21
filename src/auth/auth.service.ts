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
      const verify = this.jwtService.verify(token.replace('token ', ''))
      return verify
    } catch (err) {
      return false
    }
  }

  async tokenCpf(token: string) {
    try {
      const verify = this.jwtService.verify(token.replace('token ', ''))
      return verify.cpf
    } catch (err) {
      return false
    }
  }
}
