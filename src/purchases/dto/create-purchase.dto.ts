import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CreatePurchaseDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsInt()
  @IsNotEmpty()
  valueInCents: number

  @IsNotEmpty()
  dateOfPurchase: Date
}
