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
    const purchase = this.repository.create({
      ...createPurchaseDto,
      user,
    })
    return await this.repository.save(purchase)
  }

  findAll() {
    return `This action returns all purchases`
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`
  }
}
