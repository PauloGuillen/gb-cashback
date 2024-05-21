import { User } from 'src/users/entities/user.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  code: string

  @Column()
  valueInCents: number

  @Column()
  dateOfPurchase: Date

  @Column()
  cpf: string

  @Column({ default: 'Em validação' })
  status: string

  @ManyToOne(() => User, user => user.purchases)
  user: User
}
