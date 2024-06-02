import { Controller, Get, Post, Body, UseGuards, Headers } from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { OutputPurchaseDto } from './dto/output-purchase.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth.guard'

@Controller('purchases')
@ApiTags('purchases')
export class PurchasesController {
  constructor(
    private readonly purchasesService: PurchasesService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @Headers('authorization') token: string,
  ) {
    const cpf = await this.authService.tokenCpf(token)
    return this.purchasesService.create(cpf, createPurchaseDto)
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Headers('authorization') token: string,
  ): Promise<OutputPurchaseDto[]> {
    const cpf = await this.authService.tokenCpf(token)
    return this.purchasesService.findAll(cpf)
  }

  @Get('credit')
  @UseGuards(AuthGuard)
  async findCredit(@Headers('authorization') token: string) {
    const cpf = await this.authService.tokenCpf(token)
    return this.purchasesService.findCredit(cpf)
  }
}
