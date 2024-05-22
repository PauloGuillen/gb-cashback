import { Purchase } from '../../purchases/entities/purchase.entity'
import { PurchasesPerMonth } from '../../purchases/entities/purchases-per-month.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  cpf: string

  @Column()
  email: string

  @Column()
  password: string

  @OneToMany(() => Purchase, purchase => purchase.user)
  purchases: Purchase[]

  @OneToMany(
    () => PurchasesPerMonth,
    purchasesPerMonth => purchasesPerMonth.user,
  )
  purchasesPerMonth: PurchasesPerMonth[]
}
