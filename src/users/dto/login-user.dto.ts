import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  cpf: string

  @IsString()
  @IsNotEmpty()
  password: string
}
