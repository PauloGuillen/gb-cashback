import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ description: 'full name' })
  @IsString({})
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  cpf: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
