import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CreateOutPurchaseDto {
  code: string
  valueInCents: number
  dateOfPurchase: Date
  user: {
    name: string
    cpf: string
  }
}
