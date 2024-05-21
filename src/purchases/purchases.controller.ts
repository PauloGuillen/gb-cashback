import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { AuthGuard } from 'src/auth/auth.guard'
import { AuthService } from 'src/auth/auth.service'

@Controller('purchases')
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
  async findAll(@Headers('authorization') token: string) {
    const cpf = await this.authService.tokenCpf(token)
    return this.purchasesService.findAll(cpf)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(+id)
  }
}
