import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { Purchase } from './entities/purchase.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private repository: Repository<Purchase>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    const user = await this.usersRepository.findOne({
      where: { cpf: createPurchaseDto.cpf },
    })
    if (!user) {
      throw new NotFoundException('User not found.')
    }
    let purchase = this.repository.create({
      ...createPurchaseDto,
      user,
    })
    purchase = await this.repository.save(purchase)
    const date = new Date(purchase.dateOfPurchase)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    console.log('month: ', month)
    console.log('year: ', year)
    return purchase
  }

  findAll() {
    return `This action returns all purchases`
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`
  }

  private totalPerMonth(user: User, date: Date, valueInCents: number) {}
}
