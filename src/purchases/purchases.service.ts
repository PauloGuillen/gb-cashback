import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { Purchase } from './entities/purchase.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/users/entities/user.entity'
import { PurchasesPerMonth } from './entities/purchases-per-month.entity'

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private repository: Repository<Purchase>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PurchasesPerMonth)
    private repositoryPerMonth: Repository<PurchasesPerMonth>,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    const user = await this.findUser(createPurchaseDto.cpf)
    let purchase = this.repository.create({
      ...createPurchaseDto,
      user,
    })
    purchase = await this.repository.save(purchase)
    await this.totalPerMonth(
      user,
      new Date(purchase.dateOfPurchase),
      purchase.valueInCents,
    )
    return purchase
  }

  findAll() {
    return `This action returns all purchases`
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`
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
}
