import { User } from '../../users/entities/user.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('purchases_per_month')
export class PurchasesPerMonth {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  year: number

  @Column()
  month: number

  @Column()
  valueInCents: number

  @Column()
  cpf: string

  @ManyToOne(() => User, user => user.purchases)
  user: User
}
