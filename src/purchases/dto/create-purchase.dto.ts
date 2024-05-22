import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CreatePurchaseDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'value em centes. Interger' })
  valueInCents: number

  @IsNotEmpty()
  @ApiProperty({ description: 'ex.: 2024-04-30' })
  dateOfPurchase: Date
}
