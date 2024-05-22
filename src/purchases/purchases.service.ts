import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { Purchase } from './entities/purchase.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/users/entities/user.entity'
import { PurchasesPerMonth } from './entities/purchases-per-month.entity'
import { OutputPurchaseDto } from './dto/output-purchase.dto'
import { HttpService } from '@nestjs/axios'
import { CreateOutPurchaseDto } from './dto/create-out-purchase.dto'

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private repository: Repository<Purchase>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PurchasesPerMonth)
    private repositoryPerMonth: Repository<PurchasesPerMonth>,
    private readonly httpService: HttpService,
  ) {}

  async create(
    cpf: string,
    createPurchaseDto: CreatePurchaseDto,
  ): Promise<CreateOutPurchaseDto> {
    const user = await this.findUser(cpf)

    let status = 'Em validação'
    if (cpf === '153.509.460-56') status = 'Aprovado'
    let purchaseDto = {
      ...createPurchaseDto,
      status,
      cpf,
    }

    let purchase = this.repository.create({
      ...purchaseDto,
      user,
    })
    purchase = await this.repository.save(purchase)
    await this.totalPerMonth(
      user,
      new Date(purchase.dateOfPurchase),
      purchase.valueInCents,
    )
    return {
      code: purchase.code,
      valueInCents: purchase.valueInCents,
      dateOfPurchase: purchase.dateOfPurchase,
      user: {
        name: purchase.user.name,
        cpf: purchase.user.cpf,
      },
    }
  }

  async findAll(cpf: string): Promise<OutputPurchaseDto[]> {
    const purchases = await this.repository.find({
      where: { cpf },
      order: {
        dateOfPurchase: 'ASC',
      },
    })
    return await Promise.all(purchases.map(purchase => this.cashback(purchase)))
  }

  findCredit() {
    return this.httpService.get(
      'https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1/cashback?cpf=12312312323',
    )
  }

  private async totalPerMonth(
    user: User,
    date: Date,
    valueInCents: number,
  ): Promise<PurchasesPerMonth> {
    const dateStr = date.toISOString()
    const year = +dateStr.slice(0, 4)
    const month = +dateStr.slice(5, 7)
    const cpf = user.cpf

    let perMonth = await this.repositoryPerMonth.findOne({
      where: { cpf, year, month },
    })

    if (perMonth) {
      perMonth.valueInCents += valueInCents
    } else {
      perMonth = await this.repositoryPerMonth.create({
        year,
        month,
        valueInCents,
        cpf,
        user,
      })
    }
    return this.repositoryPerMonth.save(perMonth)
  }

  private async findUser(cpf: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { cpf },
    })
    if (!user) {
      throw new NotFoundException('User not found.')
    }
    return user
  }

  private async cashback(purchase: Purchase): Promise<OutputPurchaseDto> {
    const dateStr = purchase.dateOfPurchase.toISOString()
    const year = +dateStr.slice(0, 4)
    const month = +dateStr.slice(5, 7)

    let perMonth = await this.repositoryPerMonth.findOne({
      where: {
        cpf: purchase.cpf,
        year,
        month,
      },
    })

    let total = 0
    if (perMonth) {
      total = perMonth.valueInCents
    }

    let cachbackPerc = 0
    if (total <= 100000) cachbackPerc = 10
    else if (total <= 150000) cachbackPerc = 15
    else cachbackPerc = 20

    return {
      code: purchase.code,
      dateOfPurchase: purchase.dateOfPurchase,
      valueInCents: purchase.valueInCents,
      cachbackPerc,
      cachbackInCents: Math.round((purchase.valueInCents * cachbackPerc) / 100),
    }
  }
}
